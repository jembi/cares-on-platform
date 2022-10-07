
readonly migration_name="${1:?"FATAL: missing a parameter please provide the name of the migration"}"
readonly migration_path="./importer/analytics-datastore-clickhouse/migrations"
readonly migration_full_path="$migration_path/$(date +%s)-$migration_name.js"

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
touch $migration_full_path

echo "$migration_structure" > $migration_full_path
