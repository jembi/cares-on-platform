## Migrations

CRUD operations over Clickhouse should be done with migrations. 

Follow the steps to create and run migrations: 

### Generate Migrations 

Running `./generate-migration.sh <NAME_OF_THE_MIGRATION>` generates a new migration file with the minimum required structure. 
The name of the migration starts with a timestamp and ends with the name specified in the `NAME_OF_THE_MIGRATION` variable.

> **NOTE**  `!` 
> * Be sure to use a descriptive migration name

Example: 
```sh
./generate-migration.sh create_manufacturer_table
```

> **NOTE**  `!` 
> * Any file not starting with timestamp is not taken into consideration. Please follow the same pattern.
> * Migrations will not rerun after the first initialization.
> * Migrations should have uniqe names.

2. Edit the file as follows:

```
	const queries = [
	`CREATE TABLE test(
		id String NULL,
		version String NULL,
		inserted_at DateTime DEFAULT now(),
		last_updated Date NULL,
		// TODO: add additional properties if necessary
		) 
		ENGINE=MergeTree
		ORDER BY tuple();`,
	] 
```

* To add a column:

```
	const queries = [
	`ALTER TABLE test ADD COLUMN id String`
	] 
```

* To insert a new row:

```
	const queries = [
	`INSERT into test(version) values('x')`
	] 
```

More examples can be found in [the clickhouse documentation](https://clickhouse.com/docs/en/analyze).

### Running the Project

Refer to [the Jembi Platform Documentation](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/ozRkSu9v4EJR8LJ8nFIv/)
