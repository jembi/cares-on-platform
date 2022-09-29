---
description: A set of options to have a customized stack.
---

# Customized stack

How to override the config of each package, how to add more packages, how to use more packages from platform&#x20;

It is high likely when developing to seek for a way to run one package or two.&#x20;

Or to add more packages from Platform to the stack.

As we mentioned, it is possible to override configs as well.&#x20;

In this page, we will specify how cares-on-platform is customized.

### Running specific packages

To run specific packages, two options:

1.  &#x20;Use the CLI like mentioned in the docs and specify the packages that you want to run in cares-on-platform. \
    Example:

    ```
    ./platform-linux init <package_name> --dev --env-file="./.env.local"  
    ```
2. Edit the package-metadata.json file. \
   Note that the packages mentioned there will be running with their dependencies if you don't add `--only` flag in the CLI command.

### Override configs&#x20;

In Cares on platform, we're overriding some of the configs.

You can check for:&#x20;

* importer -> kafka-mapper-consumer: two folders that contains override configs (fhir-mapping.json and plugins)
* importer -> dashboard-visualiser-superset: will import assets related to Cares on platform project from dashboard and charts.
* importer -> analytics-datastore-clickhouse: will run the SQL queries in `clickhouseTables.js` specific to Cares on platform project.

for more instructions on how to override configs you can check [start-overriding-the-config.md](../launching-and-local-testing/start-overriding-the-config.md "mention").
