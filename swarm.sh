#!/bin/bash

declare ACTION=""
declare COMPOSE_FILE_PATH=""
declare UTILS_PATH=""
declare CONFIG_LABELS=()
declare SERVICE_IMPORTER_NAMES=()
declare STACK="cares"

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

  CONFIG_LABELS=(
    "superset"
    "kafka-mapper-consumer"
    "clickhouse"
    "hapi-fhir"
  )

  readonly ACTION
  readonly COMPOSE_FILE_PATH
  readonly CONFIG_LABELS
  readonly UTILS_PATH
  readonly SERVICE_IMPORTER_NAMES
  readonly STACK
}

# shellcheck disable=SC1091
function import_sources() {
  source "${UTILS_PATH}/docker-utils.sh"
  source "${UTILS_PATH}/config-utils.sh"
  source "${UTILS_PATH}/log.sh"
}

function remove_container() {
  if [[ -z "$*" ]]; then
    log error "$(missing_param "remove_container")"
    exit 1
  fi

  for service_name in "$@"; do
    if [[ -n $(docker container ls -aqf name="${service_name}") ]]; then
      # shellcheck disable=SC2046 # intentional word splitting
      docker container rm $(docker container ls -aqf name="${service_name}") &>/dev/null
    fi
  done
}

function clean_containers_and_configs() {
  log info "Cleaning containers and configs..."
  docker::prune_configs "superset" "kafka-mapper-consumer" "clickhouse" &>/dev/null

  remove_container "dashboard-visualiser-superset" "kafka-mapper-consumer"

  overwrite "Cleaning containers and configs... Done"
}

function restart_hapi_fhir() {
  local -r stackname="${FHIR_STACKNAME:-hapi-fhir}"
  if docker service ps -q ${stackname}_hapi-fhir &>/dev/null; then
    log info "Restarting HAPI FHIR..."
    try \
      "docker service scale ${stackname}_hapi-fhir=0" \
      throw \
      "Error scaling down hapi-fhir to update the IG"
    try \
      "docker service scale ${stackname}_hapi-fhir=$HAPI_FHIR_INSTANCES" \
      throw \
      "Error scaling up hapi-fhir to update the IG"
  else
    log warn "Service 'hapi-fhir' does not appear to be running... Skipping the restart of hapi-fhir"
  fi
}

function clean_stale_config_importers() {
  log info "Waiting to give config importers time to run before cleaning up service"

  for service_name in "${SERVICE_IMPORTER_NAMES[@]}"; do
    # Only remove the importer for fhir datastore when validation is enabled
    if [[ $DISABLE_VALIDATION == "true" ]] && [[ "${service_name}" == "hapi-fhir-config-importer" ]]; then
      continue
    fi

    config::remove_config_importer $STACK "$service_name"
    config::await_service_removed ${STACK}_"$service_name"
  done

  log info "Removing stale configs..."
  for config_label in "${CONFIG_LABELS[@]}"; do
    config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "$config_label"
  done
}

function initialize_package() {
  if [[ "${ACTION}" == "up" ]]; then
    clean_containers_and_configs
  fi

  config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml

  # Clickhouse
  config::generate_service_configs cares-clickhouse-config-importer / "${COMPOSE_FILE_PATH}/importer/analytics-datastore-clickhouse/" "${COMPOSE_FILE_PATH}/importer" clickhouse
  clickhouse_temp_compose_param="-c ${COMPOSE_FILE_PATH}/importer/docker-compose.tmp.yml"

  try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml $clickhouse_temp_compose_param $STACK" throw "Failed to deploy Cares on Platform"

  log info "Waiting to update configs"
  # Kafka Mapper Consumer
  local -r kafka_stackname="${KAFKA_STACKNAME:-kafka}"
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/src/data "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/mapping kafka-mapper-consumer
  config::update_service_configs REF_service_update_args /app/src/plugin "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/plugin kafka-mapper-consumer
  try "docker service update $REF_service_update_args ${kafka_stackname}_kafka-mapper-consumer" throw "Failed to update config for ${kafka_stackname}_kafka-mapper-consumer"
  # Superset
  local -r superset_stackname="${SUPERSET_STACKNAME:-superset}"
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/pythonpath "$COMPOSE_FILE_PATH"/importer/dashboard-visualiser-superset superset
  # TODO: Update .env.superset once the value for MAPBOX_API_KEY is known
  config::env_var_add_from_file REF_service_update_args "$COMPOSE_FILE_PATH"/.env.superset
  try "docker service update $REF_service_update_args ${superset_stackname}_dashboard-visualiser-superset" throw "Failed to update config for ${superset_stackname}_dashboard-visualiser-superset"

  # hapi-fhir
  if [[ $DISABLE_VALIDATION == "false" ]]; then
    config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.hapi-fhir-config.yml

    try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.hapi-fhir-config.yml $STACK" throw "Failed to deploy Cares on Platform (hapi-fhir)"

    restart_hapi_fhir
  else
    log warn "Validation is disabled... Skipping the deploy of hapi fhir config importer"
  fi

  clean_stale_config_importers

  clean_containers_and_configs
}

main() {
  init_vars "$@"
  import_sources

  if [[ "${ACTION}" == "init" ]] || [[ "${ACTION}" == "up" ]]; then
    if [[ "${CLUSTERED_MODE}" == "true" ]]; then
      log info "Running package in Cluster node mode"
    else
      log info "Running package in Single node mode"
    fi

    initialize_package
  elif [[ "${ACTION}" == "down" ]]; then
    log info "Cares only has down for its dependencies"
  elif [[ "${ACTION}" == "destroy" ]]; then
    log info "Destroying package"

    docker::stack_destroy $STACK
  else
    log error "Valid options are: init, up, down, or destroy"
  fi
}

main "$@"
