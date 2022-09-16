#!/bin/bash

readonly ACTION=$1

readonly STATEFUL_NODES=${STATEFUL_NODES:-"cluster"}

COMPOSE_FILE_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)
readonly COMPOSE_FILE_PATH

ROOT_PATH="${COMPOSE_FILE_PATH}/.."
readonly ROOT_PATH

. "${ROOT_PATH}/utils/config-utils.sh"
. "${ROOT_PATH}/utils/docker-utils.sh"
. "${ROOT_PATH}/utils/log.sh"

clean_containers_and_configs() {
  # shellcheck disable=SC2046 # intentional word splitting
  docker config rm $(docker config ls -q) &>/dev/null
  # shellcheck disable=SC2046 # intentional word splitting
  docker container rm $(docker container ls -aqf name=dashboard-visualiser-superset) &>/dev/null
  # shellcheck disable=SC2046 # intentional word splitting
  docker container rm $(docker container ls -aqf name=kafka-mapper-consumer) &>/dev/null
}

main() {
  if [[ "${ACTION}" == "init" ]] || [[ "${ACTION}" == "up" ]]; then
    log info "Setting config digests"
    config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml
    try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml instant" "Failed to deploy Cares on Platform"

    log info "Waiting to update configs"
    REF_service_update_args=""
    config::update_service_configs REF_service_update_args /app/src/data "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/mapping cares
    config::update_service_configs REF_service_update_args /app/src/plugin "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/plugin cares
    try "docker service update $REF_service_update_args instant_kafka-mapper-consumer" "Failed to update config for instant_kafka-mapper-consumer"
    
    REF_service_update_args=""
    config::update_service_configs REF_service_update_args /app/pythonpath "$COMPOSE_FILE_PATH"/importer/dashboard-visualiser-superset cares
    # TODO: Update .env.superset once the value for MAPBOX_API_KEY is known
    config::env_var_add_from_file REF_service_update_args "$COMPOSE_FILE_PATH"/.env.superset
    try "docker service update $REF_service_update_args instant_dashboard-visualiser-superset" "Failed to update config for instant_dashboard-visualiser-superset"

    log info "Waiting to give config importers time to run before cleaning up service"
    config::remove_config_importer cares-clickhouse-config-importer
    config::remove_config_importer cares-superset-config-importer

    # Ensure config importer is removed
    config::await_service_removed instant_cares-clickhouse-config-importer
    config::await_service_removed instant_cares-superset-config-importer

    log info "Removing stale configs..."
    config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "cares"

    log info "Cleaning containers and configs"
    clean_containers_and_configs

    # Exit 0 here to avoid false error messages
    exit 0
  elif [[ "${ACTION}" == "down" ]]; then
    log info "Cares only has down for its dependencies"
  elif [[ "${ACTION}" == "destroy" ]]; then
    # shellcheck disable=SC2046 # intentional word splitting
    docker::prune_configs "cares"
  else
    log error "Valid options are: init, up, down, or destroy"
  fi
}

main "$@"
