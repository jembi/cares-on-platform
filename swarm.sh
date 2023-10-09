#!/bin/bash

declare ACTION=""
declare COMPOSE_FILE_PATH=""
declare UTILS_PATH=""
declare CONFIG_LABELS=()
declare SERVICE_IMPORTER_NAMES=()

function init_vars() {
  ACTION=$1

  COMPOSE_FILE_PATH=$(
    cd "$(dirname "${BASH_SOURCE[0]}")" || exit
    pwd -P
  )

  UTILS_PATH="${COMPOSE_FILE_PATH}/../utils"

  SERVICE_IMPORTER_NAMES=(
    "workshop-clickhouse-config-importer"
    "workshop-superset-config-importer"
    "workshop-openhim-config-importer"
  )

  CONFIG_LABELS=(
    "superset"
    "kafka-mapper-consumer"
    "clickhouse"
    "openhim"
  )

  readonly ACTION
  readonly COMPOSE_FILE_PATH
  readonly CONFIG_LABELS
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
  if [[ -z "$*" ]]; then
    log error "$(missing_param "remove_container")"
    exit 1
  fi

  for service_name in "$@"; do
    if [[ -n $(docker container ls -aqf name="${service_name}") ]]; then
      # shellcheck disable=SC2046 # intentional word splitting
      docker container rm -f $(docker container ls -aqf name="${service_name}") &>/dev/null
    fi
  done
}

function clean_containers_and_configs() {
  log info "Cleaning containers and configs..."
  docker::prune_configs "superset" "kafka-mapper-consumer" "clickhouse" &>/dev/null

  remove_container "dashboard-visualiser-superset" "kafka-mapper-consumer"

  overwrite "Cleaning containers and configs... Done"
}

function clean_stale_config_importers() {
  log info "Waiting to give config importers time to run before cleaning up service"

  for service_name in "${SERVICE_IMPORTER_NAMES[@]}"; do
    config::remove_config_importer "instant" "$service_name"
    config::await_service_removed "instant" "$service_name"
  done

  log info "Removing stale configs..."
  for config_label in "${CONFIG_LABELS[@]}"; do
    config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "$config_label"
  done
}

function initialize_package() {
  clean_containers_and_configs

  config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml

  # Clickhouse
  config::generate_service_configs workshop-clickhouse-config-importer / "${COMPOSE_FILE_PATH}/importer/analytics-datastore-clickhouse/" "${COMPOSE_FILE_PATH}/importer" clickhouse
  clickhouse_temp_compose_param="-c ${COMPOSE_FILE_PATH}/importer/docker-compose.tmp.yml"

  try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml $clickhouse_temp_compose_param instant" throw "Failed to deploy Cares on Platform"

  log info "Waiting to update configs"
  # Kafka Mapper Consumer
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/src/data "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/mapping kafka-mapper-consumer
  config::update_service_configs REF_service_update_args /app/src/plugin "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/plugin kafka-mapper-consumer
  try "docker service update $REF_service_update_args kafka-mapper_kafka-mapper-consumer" throw "Failed to update config for kafka-mapper_kafka-mapper-consumer"
  # Superset
  REF_service_update_args=""
  config::update_service_configs REF_service_update_args /app/pythonpath "$COMPOSE_FILE_PATH"/importer/dashboard-visualiser-superset superset
  # TODO: Update .env.superset once the value for MAPBOX_API_KEY is known
  config::env_var_add_from_file REF_service_update_args "$COMPOSE_FILE_PATH"/.env.superset
  try "docker service update $REF_service_update_args superset_dashboard-visualiser-superset" throw "Failed to update config for superset_dashboard-visualiser-superset"

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

    docker::service_destroy "${SERVICE_IMPORTER_NAMES[@]}"
  else
    log error "Valid options are: init, up, down, or destroy"
  fi
}

main "$@"
