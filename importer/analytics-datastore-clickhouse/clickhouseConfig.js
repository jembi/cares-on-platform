'use strict';

var fs = require('fs');
const { ClickHouse } = require('clickhouse');

const CLICKHOUSE_HOST =
  process.env.CLICKHOUSE_HOST || 'analytics-datastore-clickhouse';
const CLICKHOUSE_PORT = parseInt(process.env.CLICKHOUSE_PORT || '8123');
const CLICKHOUSE_DEBUG = Boolean(process.env.CLICKHOUSE_DEBUG || false);

const clickhouse = new ClickHouse({
  url: CLICKHOUSE_HOST,
  port: CLICKHOUSE_PORT,
  debug: CLICKHOUSE_DEBUG,
});

const MIGRATION_FOLDER = './analytics-datastore-clickhouse/migrations';
const MIGRATION_TABLE = 'migration';

// Queries
const checkMigrationTableExistence = () => `EXISTS ${MIGRATION_TABLE}`;

const selectMigrationsQuery = () => `SELECT name FROM ${MIGRATION_TABLE}`;

const insertMigrationQuery = fileName =>
  `INSERT INTO ${MIGRATION_TABLE}(name, created_at) values('${fileName}', '${
    new Date(Number(timestamp(fileName)) * 1000).toISOString().split('.')[0]
  }')`;

const runQuery = async query => await clickhouse.query(query).toPromise();

const timestamp = fileName => fileName.substring(0, 10);

// Check if migration table exist
const migrationTableExistence = async () => {
  const migrationTblExistenceResult = await runQuery(
    checkMigrationTableExistence()
  );

  return (
    migrationTblExistenceResult.length > 0 &&
    migrationTblExistenceResult[0].result !== 0
  );
};

// Check for old migrations
const findOldMigrations = async () => {
  const isMigrationTableExist = await migrationTableExistence();

  let migrationRows = [];
  if (isMigrationTableExist) {
    migrationRows = await runQuery(selectMigrationsQuery());
  }

  let oldMigrationsNames = [];
  if (migrationRows.length > 0) {
    oldMigrationsNames = migrationRows.map(e => e.name);
  }

  return oldMigrationsNames;
};

// Filter old migration files & the ones that does not have a timestamp
const filterFiles = async files => {
  if (files.length === 0) return [];

  const oldMigrations = await findOldMigrations();
  const filteredFiles = files
    .filter(
      filename =>
        parseInt(filename && timestamp(filename)) &&
        oldMigrations.indexOf(filename) === -1
    )
    .sort((a, b) => timestamp(a) - timestamp(b));

  if (filteredFiles.length === 0) {
    console.warn('No [new] migrations files found. Exit..');
  }
  return filteredFiles;
};

// Run the queries in each migration file
const runFileQueries = async fileName => {
  console.log(`\nRunning ${fileName}..`);

  const queries = require(`${MIGRATION_FOLDER}/${fileName}`);

  queries.push(insertMigrationQuery(fileName));

  for await (const query of queries) {
    const res = await runQuery(query);
    if (res.r == 1) console.log(`> ${query.substring(0, 30)}... Successful`);
  }
};

(async () => {
  try {
    if (fs.existsSync(MIGRATION_FOLDER)) {
      var files = fs.readdirSync(MIGRATION_FOLDER);

      // Filter files
      const filteredFiles = await filterFiles(files);

      for await (const fileName of filteredFiles) {
        await runFileQueries(fileName);
      }
    } else {
      console.warn('No migrations folder found. Exit..');
    }
  } catch (err) {
    console.log('An error has occured.\n');
    throw new Error(err);
  }
})();
