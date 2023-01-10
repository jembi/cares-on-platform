#!/bin/bash

declare ACTION=""
declare COMPOSE_FILE_PATH=""
declare UTILS_PATH=""
declare SERVICE_IMPORTER_NAMES=()

function init_vars() {
  ACTION=$1

  COMPOSE_FILE_PATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
  )

  UTILS_PATH="${COMPOSE_FILE_PATH}/../utils"

  SERVICE_IMPORTER_NAMES=(
    "cares-clickhouse-config-importer"
    "cares-superset-config-importer"
    "hapi-fhir-config-importer"
  )

  readonly ACTION
  readonly COMPOSE_FILE_PATH
  readonly UTILS_PATH
  readonly SERVICE_IMPORTER_NAMES
}

# shellcheck disable=SC1091
function import_sources() {
  source "${UTILS_PATH}/docker-utils.sh"
  source "${UTILS_PATH}/config-utils.sh"
  source "${UTILS_PATH}/log.sh"
}

function remove_container() {
  local -r SERVICE_NAME=${1:?$(missing_param "remove_container")}

  if [[ -n $(docker container ls -aqf name="${SERVICE_NAME}") ]]; then
    # shellcheck disable=SC2046 # intentional word splitting
    docker container rm $(docker container ls -aqf name="${SERVICE_NAME}") &>/dev/null
  fi
}

function clean_containers_and_configs() {
  log info "Cleaning containers and configs..."
  docker::prune_configs "superset" &>/dev/null
  docker::prune_configs "kafka-mapper-consumer" &>/dev/null
  docker::prune_configs "clickhouse" &>/dev/null

  remove_container "dashboard-visualiser-superset"
  remove_container "kafka-mapper-consumer"

  overwrite "Cleaning containers and configs... Done"
}

function restart_hapi_fhir() {
  if docker service ps -q instant_hapi-fhir &>/dev/null; then
    log info "Restarting HAPI FHIR..."
    try \
      "docker service scale instant_hapi-fhir=0" \
      catch \
      "Error scaling down hapi-fhir to update the IG"
    try \
      "docker service scale instant_hapi-fhir=$HAPI_FHIR_INSTANCES" \
      catch \
      "Error scaling up hapi-fhir to update the IG"
  else
    log warn "Service 'hapi-fhir' does not appear to be running... Skipping the restart of hapi-fhir"
  fi
}

function cleaning() {
  log info "Waiting to give config importers time to run before cleaning up service"
  config::remove_config_importer cares-clickhouse-config-importer
  config::remove_config_importer cares-superset-config-importer
  config::remove_config_importer hapi-fhir-config-importer

  # Ensure config importer is removed
  config::await_service_removed instant_cares-clickhouse-config-importer
  config::await_service_removed instant_cares-superset-config-importer
  config::await_service_removed instant_hapi-fhir-config-importer

  log info "Removing stale configs..."
  config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "superset"
  config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "clickhouse"
  config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "hapi-fhir"
}

function initialize_package() {
  if [[ "${ACTION}" == "up" ]]; then
    clean_containers_and_configs
  fi

  config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml

  # Clickhouse
  config::generate_service_configs cares-clickhouse-config-importer / "${COMPOSE_FILE_PATH}/importer/analytics-datastore-clickhouse/" "${COMPOSE_FILE_PATH}/importer" clickhouse
  clickhouse_temp_compose_param="-c ${COMPOSE_FILE_PATH}/importer/docker-compose.tmp.yml"

  try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml $clickhouse_temp_compose_param instant" catch "Failed to deploy Cares on Platform"

  log info "Waiting to update configs"
  # Kafka Mapper Consumer
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/src/data "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/mapping kafka-mapper-consumer
  config::update_service_configs REF_service_update_args /app/src/plugin "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/plugin kafka-mapper-consumer
  try "docker service update $REF_service_update_args instant_kafka-mapper-consumer" catch "Failed to update config for instant_kafka-mapper-consumer"
  # Superset
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/pythonpath "$COMPOSE_FILE_PATH"/importer/dashboard-visualiser-superset superset
  # TODO: Update .env.superset once the value for MAPBOX_API_KEY is known
  config::env_var_add_from_file REF_service_update_args "$COMPOSE_FILE_PATH"/.env.superset
  try "docker service update $REF_service_update_args instant_dashboard-visualiser-superset" catch "Failed to update config for instant_dashboard-visualiser-superset"

  cleaning

  restart_hapi_fhir

  clean_containers_and_configs
}

main() {
  init_vars "$@"
  import_sources

  if [[ "${ACTION}" == "init" ]] || [[ "${ACTION}" == "up" ]]; then
    log info "Running package in single node mode"

    initialize_package
  elif [[ "${ACTION}" == "down" ]]; then
    log info "Cares only has down for its dependencies"
  elif [[ "${ACTION}" == "destroy" ]]; then
    log info "Destroying package"

    docker::service_destroy "${SERVICE_IMPORTER_NAMES[@]}"
  else
    log error "Valid options are: init, up, down, or destroy"
  fi
}

main "$@"
