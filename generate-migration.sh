#!/usr/bin/env bash

FILE_PATH=$(
  cd "$(dirname "${BASH_SOURCE[0]}")" || exit
  pwd -P
)

readonly migration_name="${1:?"FATAL: generate-migration.sh is missing a parameter. Usage: generate-migration.sh <migration_name>"}"
readonly migration_path="$FILE_PATH/importer/analytics-datastore-clickhouse/migrations"

migration_full_path="$migration_path/$(date +%s)-$migration_name.js"
readonly migration_full_path

readonly migration_structure="const queries = [
  // edit these lines
  \`CREATE OR REPLACE TABLE test(
        inserted_at DateTime DEFAULT now(),
        name String,
        created_at DateTime,
    ) 
    ENGINE=MergeTree
    ORDER BY tuple();\`,
];
module.exports = queries;"

# Create the migration file
touch "$migration_full_path"

echo "$migration_structure" > "$migration_full_path"
