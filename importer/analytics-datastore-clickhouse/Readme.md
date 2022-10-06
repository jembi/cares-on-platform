## Migrations

CRUD operations over Clickhouse should be done with migrations. 

Follow the steps to create and run migrations: 

### 1. Create a new migration with the following command: 

You should cd into the migration folder `cares-on-platform > importer > analytics-datastore-clickhouse > migrations`, and run the following:

```
touch $(date +%s)-<NAME_OF_THE_MIGRATION>.js
```

`NAME_OF_THE_MIGRATION` : Descriptive name of the new changes. 

Example: 
```
touch ./migrations/$(date +%s)-Create_manufacturer_table.js
```

> **NOTE**  `!` 
> * Any file not starting with timestamp will not be taken into consideration. Please follow the same pattern.
> * Migrations will not rerun after the first initialization.
> * Migrations should have different names.

### 2. Edit the file as follows:

First you need to declare the queries table: 

```
const queries = [

    // Here we will add the queries
];

module.exports = queries;
```

Example of queries: 

* To create new tables, edit & add the following query: 

```
 const queries = [
    `CREATE TABLE test(
		id String NULL,
		version String NULL,
		inserted_at DateTime DEFAULT now(),
		last_updated Date NULL,
        // You can add other properties
	  ) 
	  ENGINE=MergeTree
	  ORDER BY tuple();`,
 ] 
```

* To change a type of a column (Example):

```
 const queries = [
    `ALTER TABLE test MODIFY COLUMN id String`
 ] 
```
* To insert a new row:

```
 const queries = [
    `INSERT into test(version) values('x')`
 ] 
```
 
More examples in [the docs of clickhouse](https://clickhouse.com/docs/en/analyze).

### 3. Run the platform 

If it is a new initalization, all the migrations will run from the start: 

`./platform init ...`

If it is an update, only the new migrations added after last deploy will run:

`./platform up ...`