---
description: Access services and the difference between both modes.
---

# Dev & Prod mode

how to access different components in dev mode vs in prod mode

### Enable DEV mode

To enable dev mode and as the Platform CLI docs mentioned, all you need to do is to add `--dev` if it is not already there to the commands as follows: &#x20;

`./deploy-local.sh init --dev`

`or`&#x20;

`./deploy-local-combo.sh init --dev`

### Accessible services in DEV mode locally

Running in Dev mode locally will allow you to access the following services:&#x20;

* _Openhim_: [`http://127.0.0.1:9000`](http://127.0.0.1:9000)`or`[`http://localhost:9000`](http://localhost:9000)``
* _Kafdrop_: [`http://127.0.0.1:9013`](http://127.0.0.1:9013) or [`http://localhost:9013`](http://localhost:9013)``
* _Clickhouse_: [`http://127.0.0.1:8124/play`](http://localhost:8124/play?)or [`http://localhost:8124/play`](http://localhost:8124/play?)__
* _Superset_: [`http://127.0.0.1:8089`](http://localhost:8124/play?)or [`http://localhost:8089`](http://localhost:8124/play?)``

### DEV vs PROD&#x20;

The following services will not be accessible in Prod mode:&#x20;

* Kafdrop
* Clickhouse
