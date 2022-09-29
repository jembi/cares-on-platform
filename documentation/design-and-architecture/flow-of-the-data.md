---
description: To check for the data in different stages.
---

# Flow of the data

For testing purposes, it is feasible to use Postman Bundle to send random data, or to use an EMR.

To follow the the data going through all the services you need to check in order:

### 1. OpenHIM

In the transaction logs, you can find your request.\
Openhim provide an UI with filters, so you can use the filters to get your request or to check the last request.

For local testing

_url_: [`http://127.0.0.1:9000`](http://127.0.0.1:9000)`or`[`http://localhost:9000`](http://localhost:9000)``

_user_: `root@openhim.org`

_password_: `instant101`

### 2. SanteMPI (when running with DISI)

It is advised to check the data in santeMPI. \
SanteMPI will wait for your confirmation if it finds a probable match of two patients.&#x20;

_url_: [`http://127.0.0.1:9200`](http://127.0.0.1:9200)`or`[`http://localhost:9200`](http://localhost:9200)``

NB: Check [Disi On Platform](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/dJz9iVEVoDa2Xr636ydC/ "mention")SanteMPI component for more info.

### 3. Kafdrop (when running in DEV mode)

It is advised to check Kafdrop to see if the topics were created successfully in Kafka and the topics contain messages.&#x20;

_url_: [`http://127.0.0.1:9013`](http://127.0.0.1:9013) or [`http://localhost:9013`](http://localhost:9013)``

### 4. Clickhouse (when running in DEV mode)

Clickhouse provide a playground to run SQL queries. You can run some queries to check if the tables were filled with data as expected.&#x20;

_url_: [`http://127.0.0.1:8124/play`](http://localhost:8124/play?)or [`http://localhost:8124/play`](http://localhost:8124/play?)``

### 5. Superset&#x20;

In PROD mode, checking Superset is a good choice to check for data in Clickhouse. Superset provide a SQL Lab to run SQL queries against the chosen dataset.&#x20;

A link between Clickhouse and Superset is configured per default, and you can run there some queries to check for incoming data.&#x20;

You can check the dashboard and the charts as well.

_url_: [http://127.0.0.1:8089](http://localhost:8124/play?) or [http://localhost:8089](http://localhost:8124/play?)

_user_: `admin`

_password_: `admin`
