---
description: A general description of the different components.
---

# General Architecture

Cares meant to work alongside with Disi.

So in the following we will give the general architecture of cares in a high overview and also of cares+disi.

### Cares&#x20;

The general architecture of Cares on platform is simplified as follow:&#x20;

* Hapi-fhir: A service to validate and store the fhir messages
* Kafka: message bus queue, it has different topics (2xx, 4xx, 5xx, etc).
* Kafka-unbundler-consumer: it is a Kafka processor that will consume 2xx topic messages, split them according to the resource type and then sending them back to new topics.
* Kafka-mapper-consumer: It is a Kafka processor that will flatten and transform the data and store it in Clickhouse.
* Clickhouse: The database that contains the flattened data.
* Superset: The tool for dashboards and charts.

### Cares + Disi

The general architecture of Cares on platform + Disi on platform is simplified as follow (with focus on Cares components):&#x20;

* Openhim: interoperability layer for routing incoming events from the client
* SanteMPI: A patient matcher and deduplicater, it is used to make sure there is no duplicate patients, it is going to save patients into a topic 2xx in Kafka after FHIR validation and checking.
* Kafka: message bus queue, it has different topics (2xx, 4xx, 5xx, etc).
* Kafka-unbundler-consumer: it is a Kafka processor that will consume 2xx topic messages, split them according to the resource type and then sending them back to new topics.
* Kafka-mapper-consumer: It is a Kafka processor that will flatten and transform the data and store it in Clickhouse.
* Clickhouse: The database that contains the flattened data.
* Superset: The tool for dashboards and charts.

Other components from Disi will be existent such as Logstash, Elasticsearch, Kibana and Jsreport.

### NOTE

If running Cares + Disi, the only difference will be the non-existence of Hapi-proxy, and the integration of SanteMPI package with two additional mediators (check [Disi On Platform](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/dJz9iVEVoDa2Xr636ydC/ "mention") for additional reading). In this case, santeMPI will be sending data to the kafka 2xx topic instead of hapi-proxy.
