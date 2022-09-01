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

main() {
  if [[ "${ACTION}" == "init" ]] || [[ "${ACTION}" == "up" ]]; then
    log info "Setting config digests"
    config::set_config_digests "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml
    try "docker stack deploy -c ${COMPOSE_FILE_PATH}/importer/docker-compose.config.yml instant" "Failed to deploy Cares on Platform"

    log info "Waiting to give config importers time to run before cleaning up service"

    config::remove_config_importer cares-openhim-config-importer
    config::remove_config_importer cares-clickhouse-config-importer
    config::remove_config_importer cares-superset-config-importer

    # Ensure config importer is removed
    config::await_service_removed instant_cares-openhim-config-importer
    config::await_service_removed instant_cares-clickhouse-config-importer
    config::await_service_removed instant_cares-superset-config-importer

    log info "Removing stale configs..."
    config::remove_stale_service_configs "$COMPOSE_FILE_PATH"/importer/docker-compose.config.yml "cares"
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
