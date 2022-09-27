---
description: Cares + Disi.
---

# Launch Cares & Disi

As we said, Cares meant to work with Disi, so only two easy steps are required:&#x20;

### Edit & check your Environment Variables

To launch Cares + Disi, we're going to use .env.local-combo file.

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

### Launch Cares + Disi

In this section, we're assuming that you already followed the steps in [..](../ "mention") page.

In that case, to to launch Cares and Disi all you have to do is to run the command:

`./deploy-local-combo.sh init`&#x20;

The following options can be passed to the `./deploy-local-combo.sh` command:

* `init` for initializing the services
* `down` for stopping the services
* `up` for bringing the services up
* `destroy` for removing the services&#x20;
