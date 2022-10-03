#!/bin/bash

readonly ACTION=$1

readonly STATEFUL_NODES=${STATEFUL_NODES:-"single"}

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
  docker config rm $(docker config ls -qf label=name=superset) &>/dev/null # Remove superset configs
  docker config rm $(docker config ls -qf label=name=kafka-mapper-consumer) &>/dev/null # Remove kafka-mapper-consumer configs
  docker config rm $(docker config ls -qf label=name=clickhouse) &>/dev/null # Remove clickhouse configs

  # shellcheck disable=SC2046 # intentional word splitting
  docker container rm $(docker container ls -aqf name=dashboard-visualiser-superset) &>/dev/null
  # shellcheck disable=SC2046 # intentional word splitting
  docker container rm $(docker container ls -aqf name=kafka-mapper-consumer) &>/dev/null
}

main() {
  if [[ "${ACTION}" == "init" ]] || [[ "${ACTION}" == "up" ]]; then
    if [[ "${ACTION}" == "up" ]]; then
      clean_containers_and_configs
    fi
    log info "Setting config digests"
    config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml
    try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml instant" "Failed to deploy Cares on Platform"

    log info "Waiting to update configs"
    REF_service_update_args=""
    config::update_service_configs REF_service_update_args /app/src/data "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/mapping kafka-mapper-consumer
    config::update_service_configs REF_service_update_args /app/src/plugin "$COMPOSE_FILE_PATH"/importer/kafka-mapper-consumer/plugin kafka-mapper-consumer
    try "docker service update $REF_service_update_args instant_kafka-mapper-consumer" "Failed to update config for instant_kafka-mapper-consumer"
    
    REF_service_update_args=""
    config::update_service_configs REF_service_update_args /app/pythonpath "$COMPOSE_FILE_PATH"/importer/dashboard-visualiser-superset superset
    # TODO: Update .env.superset once the value for MAPBOX_API_KEY is known
    config::env_var_add_from_file REF_service_update_args "$COMPOSE_FILE_PATH"/.env.superset
    try "docker service update $REF_service_update_args instant_dashboard-visualiser-superset" "Failed to update config for instant_dashboard-visualiser-superset"

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

    log info "Cleaning containers and configs"
    clean_containers_and_configs

    # Exit 0 here to avoid false error messages
    exit 0
  elif [[ "${ACTION}" == "down" ]]; then
    log info "Cares only has down for its dependencies"
  elif [[ "${ACTION}" == "destroy" ]]; then
    log info "Cares only has destroy for its dependencies"
  else
    log error "Valid options are: init, up, down, or destroy"
  fi
}

main "$@"
