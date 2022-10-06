const queries = [
  // Resource Tables
  `CREATE OR REPLACE TABLE migration(
        inserted_at DateTime DEFAULT now(),
        name String,
        created_at DateTime,
    ) 
    ENGINE=MergeTree
    ORDER BY tuple();`,
];

module.exports = queries;
