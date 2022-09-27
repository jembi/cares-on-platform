---
description: To Launch Cares only.
---

# Launch Cares

Cares on platform meant to work alongside with Disi.\
However, if you want to launch it alone it is possible :tada:

Steps are as follows:&#x20;

### Add OpenHIM configs

Because Cares-on-platform meant to work with DISI, and DISI have already configured openHIM. We didn't include openHIM configs so you should add it:

* Create a folder under `importer` called `interoperability-layer-openhim`
*   Add first file called under the folder created in the first step: `openhimConfig.js` \
    Copy the following code in that file:&#x20;

    {% code title="openhimConfig.js" %}
    ```
    'use strict'

    const fs = require('fs')
    const https = require('https')
    const path = require('path')

    const OPENHIM_CORE_SERVICE_NAME = process.env.OPENHIM_CORE_SERVICE_NAME || 'openhim-core'
    const OPENHIM_API_PASSWORD =
      process.env.OPENHIM_API_PASSWORD || 'openhim-password'
    const OPENHIM_MEDIATOR_API_PORT = process.env.OPENHIM_MEDIATOR_API_PORT || 8080
    const OPENHIM_API_USERNAME =
      process.env.OPENHIM_API_USERNAME || 'root@openhim.org'

    const authHeader = new Buffer.from(
      `${OPENHIM_API_USERNAME}:${OPENHIM_API_PASSWORD}`
    ).toString('base64')

    const jsonData = JSON.parse(
      fs.readFileSync(path.resolve(__dirname, 'openhim-import.json'))
    )

    const data = JSON.stringify(jsonData)

    const options = {
      protocol: 'https:',
      hostname: OPENHIM_CORE_SERVICE_NAME,
      port: OPENHIM_MEDIATOR_API_PORT,
      path: '/metadata',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
        Authorization: `Basic ${authHeader}`
      }
    }

    const req = https.request(options, res => {
      if (res.statusCode == 401) {
        throw new Error(`Incorrect OpenHIM API credentials`)
      }

      if (res.statusCode != 201) {
        throw new Error(`Failed to import OpenHIM config: ${res.statusCode}`)
      }

      console.log('Successfully Imported OpenHIM Config')
    })

    req.on('error', error => {
      console.error('Failed to import OpenHIM config: ', error)
    })

    req.write(data)
    req.end()
    ```
    {% endcode %}
*   Create another file called: `openhim-import.json`\
    Copy the following code in that file:&#x20;

    {% code title="openhim-import.json" %}
    ```
    {
      "Users": [
        {
          "groups": ["admin"],
          "firstname": "Super",
          "surname": "User",
          "email": "root@openhim.org",
          "passwordAlgorithm": "sha512",
          "passwordHash": "ea3824f17cf1379eb118a36bc7c8cf0f45712e2af7748567fca5313dec6fa66d61064e82a5e5cb88e998486ee3c7d0dac235bbeda8c341d6edc1c77406be2ab6",
          "passwordSalt": "d4f622c0404f09bd959bfb263efa3452",
          "expiry": null,
          "locked": false,
          "token": null,
          "tokenType": null
        }
      ],
      "Clients": [
        {
          "roles": ["instant"],
          "customTokenID": "test",
          "clientID": "instant-client",
          "name": "Instant Client"
        }
      ],
      "Channels": [
        {
          "methods": ["POST", "DELETE"],
          "type": "http",
          "allow": ["instant"],
          "whitelist": [],
          "authType": "private",
          "matchContentTypes": [],
          "properties": [],
          "txViewAcl": [],
          "txViewFullAcl": [],
          "txRerunAcl": [],
          "status": "enabled",
          "rewriteUrls": false,
          "addAutoRewriteRules": true,
          "autoRetryEnabled": false,
          "autoRetryPeriodMinutes": 60,
          "routes": [
            {
              "type": "http",
              "status": "enabled",
              "forwardAuthHeader": false,
              "name": "FHIR Server",
              "secured": false,
              "host": "hapi-proxy",
              "port": 18080,
              "path": "",
              "pathTransform": "",
              "primary": true,
              "username": "",
              "password": ""
            }
          ],
          "requestBody": true,
          "responseBody": true,
          "rewriteUrlsConfig": [],
          "name": "FHIR Server",
          "description": "A FHIR server (HAPI FHIR)",
          "urlPattern": "^/fhir.*$",
          "priority": 1,
          "matchContentRegex": null,
          "matchContentXpath": null,
          "matchContentValue": null,
          "matchContentJson": null,
          "pollingSchedule": null,
          "tcpHost": null,
          "tcpPort": null,
          "updatedBy": {
            "id": "5e2eca110bb0420011f0cd84",
            "name": "Super User"
          },
          "alerts": []
        },
        {
          "methods": ["POST"],
          "type": "http",
          "allow": ["instant"],
          "whitelist": [],
          "authType": "private",
          "matchContentTypes": [],
          "properties": [],
          "txViewAcl": [],
          "txViewFullAcl": [],
          "txRerunAcl": [],
          "status": "enabled",
          "rewriteUrls": false,
          "addAutoRewriteRules": true,
          "autoRetryEnabled": false,
          "autoRetryPeriodMinutes": 60,
          "routes": [
            {
              "type": "http",
              "status": "enabled",
              "forwardAuthHeader": false,
              "name": "Reprocess Endpoint",
              "secured": false,
              "host": "reprocess-mediator",
              "port": 3000,
              "path": "/reprocess",
              "pathTransform": "",
              "primary": true,
              "username": "",
              "password": ""
            }
          ],
          "requestBody": true,
          "responseBody": true,
          "rewriteUrlsConfig": [],
          "name": "Reprocess Mediator",
          "description": "Monitor reprocessed data triggered by this mediator",
          "urlPattern": "^/reprocess$",
          "matchContentRegex": null,
          "matchContentXpath": null,
          "matchContentValue": null,
          "matchContentJson": null,
          "pollingSchedule": null,
          "tcpHost": null,
          "tcpPort": null,
          "updatedBy": {
            "id": "6128a65ed529a100137ab88b",
            "name": "Super User"
          },
          "alerts": []
        },
        {
          "methods": ["GET"],
          "type": "http",
          "allow": ["instant"],
          "whitelist": [],
          "authType": "private",
          "matchContentTypes": [],
          "properties": [],
          "txViewAcl": [],
          "txViewFullAcl": [],
          "txRerunAcl": [],
          "status": "enabled",
          "rewriteUrls": false,
          "addAutoRewriteRules": true,
          "autoRetryEnabled": false,
          "autoRetryPeriodMinutes": 60,
          "updatedBy": {
            "id": "6180fecba6295300160c5319",
            "name": "Super User"
          },
          "routes": [
            {
              "type": "http",
              "status": "enabled",
              "forwardAuthHeader": false,
              "name": "FHIR Server",
              "secured": false,
              "host": "hapi-fhir",
              "port": 8080,
              "path": "",
              "pathTransform": "",
              "primary": true,
              "username": "",
              "password": ""
            }
          ],
          "requestBody": true,
          "responseBody": true,
          "rewriteUrlsConfig": [],
          "description": "A channel to allow queries on the FHIR Server directly",
          "urlPattern": "^/fhir.*$",
          "priority": 2,
          "matchContentRegex": null,
          "matchContentXpath": null,
          "matchContentValue": null,
          "matchContentJson": null,
          "pollingSchedule": null,
          "tcpHost": null,
          "tcpPort": null,
          "alerts": [],
          "name": "FHIR Server Direct"
        }
      ]
    }

    ```
    {% endcode %}
*   Now, we need to add the service that will import the configs. \
    Add the following the `docker-compose.config.yml` file inside the `importer` folder:&#x20;

    {% code title="docker-compose.config.yml" %}
    ```
    services: 
    ...
    // Add the openHIM config importer service:
      cares-openhim-config-importer:
        image: jembi/instantohie-config-importer
        deploy:
          restart_policy:
            condition: none
        environment:
          OPENHIM_API_HOSTNAME: 'openhim-core'
          OPENHIM_API_PORT: 8080
          OPENHIM_API_USERNAME: 'root@openhim.org'
          OPENHIM_API_PASSWORD: 'instant101'
          # Reject unauthorised is only needed if the OpenHIM's SSL is not setup
          NODE_TLS_REJECT_UNAUTHORIZED: 0
        configs:
          - source: cares-openhim-config-openhimConfig.js
            target: /openhimConfig.js
          - source: cares-openhim-config-openhim-import.json
            target: /openhim-import.json
        # This command will only attempt to import the OpenHIM config when the heartbeat responds with a 2xx
        command: sh -c "wait-on -t 60000 https-get://openhim-core:8080/heartbeat && node /openhimConfig.js"

    configs:
    ...
    // Add the openHIM configs
      cares-openhim-config-openhimConfig.js:
        file: ./openhim/openhimConfig.js
        name: cares-openhim-config-openhimConfig.js-${cares_openhim_config_openhimConfig_js_DIGEST:?err}
        labels:
          name: cares
      cares-openhim-config-openhim-import.json:
        file: ./openhim/openhim-import.json
        name: cares-openhim-config-openhim-import.json-${cares_openhim_config_openhim_import_json_DIGEST:?err}
        labels:
          name: cares

    ```
    {% endcode %}
*   The openHIM config importer should be removed after importing, so we need to add the two following lines in the `swarm.sh` script:&#x20;

    <pre data-title="swarm.sh"><code><strong>...
    </strong>config::remove_config_importer cares-superset-config-importer
    // Next line should be added
    config::remove_config_importer cares-openhim-config-importer 
    <strong>...
    </strong>config::await_service_removed instant_cares-superset-config-importer
    // Next line should be added
    config::await_service_removed instant_cares-openhim-config-importer
    ...</code></pre>
*   Finally, as we don't have santeMPI in Cares, we will need the routing proxy to send the events to hapi-fhir, so it is imperative to add the hapi-proxy in the list of the dependencies of package-metadata.json in cares-on-platform:&#x20;

    ```
    "dependencies": [
        ...,
        // Add the following
        "interoperability-layer-openhim",
        "message-bus-helper-hapi-proxy"
      ],
    ```

Now, you should configured openHIM successfully.

### Edit & check your Environment Variables

To launch Cares only, we're going to use .env.local file.

This file is initialized and have default values to work in single mode locally.

Please make sure you go through it and not forget to update the variables that should be updated.

Example: in single mode, the instances should have a value = 1 also Mongo and Postgres URLs should ping to one host: &#x20;

```
...
MONGO_SET_COUNT=1
OPENHIM_MONGO_URL=mongodb://mongo-1:27017/openhim
OPENHIM_MONGO_ATNAURL=mongodb://mongo-1:27017/openhim

# FHIR Datastore - HAPI FHIR

HAPI_FHIR_INSTANCES=1
REPMGR_PRIMARY_HOST=postgres-1
REPMGR_PARTNER_NODES=postgres-1
POSTGRES_REPLICA_SET=postgres-1:5432
```

### Launch Cares

In this section, we're assuming that you already followed the steps in [..](../ "mention") page.

In that case, to to launch cares all you have to do is to run the command:

`./deploy-local.sh init`&#x20;

The following options can be passed to the `./deploy-local.sh` command:

* `init` for initializing the services
* `down` for stopping the services
* `up` for bringing the services up
* `destroy` for removing the services&#x20;
