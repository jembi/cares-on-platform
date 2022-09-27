---
description: Folders and files insights.
---

# General Structure

Cares on platform is structured as follows:&#x20;

* **importer folder:** this folder contains the different packages that we need to override their configuration. \
  Each subfolder with the same name of the package in the Platform will contain the overridden files. \
  It contains `docker-compose.config.yml` file that will run the services for the same purpose.
* .**env.\* files:** these files will contain the definition of the environment variables needed to run the project.&#x20;
* **deploy-local\*.sh:** bash script to launch the Platform and Cares on platform as a custom package.
* **swarm.sh:** the bash script to deploy the cares on platform package.
* **banner.txt:** the banner displayed when running the CLI.
* **package-metadata.json:** this file contains the metadata: name, description, dependencies, etc.
* **get-cli.sh:** the bash script to get the platform-cli (platform-linux, platform-macos or `platform.exe binaries).`

It is possible to add `packages` folder in case we need to add new packages that doesn't exist in the Jembi Platform.

Other files are used for different purposes.

### Clickhouse config importer

The file `clickhouseTables.js` contains a set of SQL queries to:

* Initialize the tables needed in Clickhouse and its schema
* Create the views
* Create the reference tables such as Manufacturer and insert its static data&#x20;

### Superset config importer

The ZIP file `superset-export.zip` contains the following:&#x20;

* Connection to clickhouse database
* Saved Dataset&#x20;
* Charts&#x20;
* Dashboard

### Kafka Mapper Consumer Config importer

The folder contains two folders:&#x20;

* mapping: contains the file`fhir-mapping.json` to override the one in the Platform, it is used to define the mapping related to Cares.
* plugin: some mappings in the `fhir-mapping.json` needs plugins to create fields out of specific conditions. This folder contains these plugins.
