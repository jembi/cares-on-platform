---
description: 'Before launching the cares: customize your configs.'
---

# Start overriding the config

In this page, we will detail the steps to override the configs in Cares-on-platform. \
As an example, we're going to override **Superset** configuration that was initialized in Platform:

#### Create a folder of the target package in Cares-on-platform

Our package that we need to override its config called in the Platform: dashboard-visualiser-superset, it is a good practice to create a folder with the same name under `importer` folder.

Now we have: `importer` -> `dashboard-visualiser-superset`&#x20;

#### Configuration files

If you check the platform, you will find a folder called `importer`inside `dashboard-visualiser-superset` package, what inside that folder are the files that you need to configure Superset.&#x20;

We have:&#x20;

* A JS script that will send the request to import the assets.
* A ZIP file that contains the extracted assets&#x20;

Each package will have its own files and its own logic to initialize and configure it.

You will need the JS script to use it as it is (it is possible that you will need to create your own script in other cases)

You should have exported a new ZIP file from Superset that contains the new configs (check the docs of Superset).

You can put these two files under `importer` -> `dashboard-visualiser-superset.`

#### Docker compose config update

If you check `importer` -> `docker-compose.config.yml` you will find already some services declared with their configs declaration. You will need to add the Superset config-importer service and their new configs.&#x20;

```
// superset config importer service 
cares-superset-config-importer:
    image: node:erbium-alpine
    deploy:
      restart_policy:
        condition: none
    environment:
      SUPERSET_SERVICE_NAME: 'dashboard-visualiser-superset'
      SUPERSET_API_PORT: 8088
      SUPERSET_API_PASSWORD: ${SUPERSET_API_PASSWORD:-admin}
      SUPERSET_API_USERNAME: ${SUPERSET_API_USERNAME:-admin}
      CONFIG_FILE: ${CONFIG_FILE:-superset-export.zip}
      SUPERSET_SSL: ${SUPERSET_SSL:-false}
    configs:
      - source: cares-superset-config-supersetConfig.js
        target: /supersetConfig.js
      - source: cares-superset-config-superset-export.zip
        target: /superset-export.zip
    command: sh -c "cd / && npm i axios form-data && node /supersetConfig.js"

// superset configs
configs:
  cares-superset-config-supersetConfig.js:
    file: ./dashboard-visualiser-superset/supersetConfig.js
    name: cares-superset-config-supersetConfig.js-${cares_superset_config_supersetConfig_js_DIGEST:?err}
    labels:
      name: cares
  cares-superset-config-superset-export.zip:
    file: ./dashboard-visualiser-superset/superset-export.zip
    name: cares-superset-config-superset-export.zip-${cares_superset_config_superset_export_zip_DIGEST:?err}
    labels:
      name: cares
```

Make sure in this step that you use a light image (example: node image) and to give the configs a label: `cares`.

#### Update Swarm.sh bash script

Last, don't forget to update the swarm.sh to remove the config importers.

Example:&#x20;

```
config::remove_config_importer cares-superset-config-importer
```



