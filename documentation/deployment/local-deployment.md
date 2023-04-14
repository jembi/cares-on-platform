# Local deployment

To deploy locally, you can follow the sections:&#x20;

* [launch-cares.md](../launching-and-local-testing/launch-cares.md "mention"): to start cares-on-platform only
* [launch-cares-and-disi.md](../launching-and-local-testing/launch-cares-and-disi.md "mention"): to start Cares + Disi

The necessary services that should be up and running after launching:&#x20;

* clickhouse\_analytics-datastore-clickhouse
* superset\_dashboard-visualiser-superset
* kafka\_kafdrop
* kafka\_kafka
* kafka\_kafka-mapper-consumer
* kafka\_kafka-unbundler-consumer
* kafka\_zookeeper-1

If launching cares only, some additional services should exist:&#x20;

* hapi-proxy\_hapi-proxy
* hapi-fhir\_hapi-fhir&#x20;
* hapi-fhir\_postgres-1
* openhim\_mongo-1&#x20;
* openhim\_openhim-console
* openhim\_openhim-core&#x20;

If launching cares + disi, the following services should be up as well:&#x20;

* elasticsearch\_analytics-datastore-elastic-search
* jsreport\_dashboard-visualiser-jsreport
* kibana\_dashboard-visualiser-kibana
* hapi-fhir\_hapi-fhir&#x20;
* hapi-fhir\_postgres-1
* openhim\_mongo-1&#x20;
* openhim\_openhim-console
* openhim\_openhim-core&#x20;
* santempi\_santedb-mpi&#x20;
* santempi\_santedb-www
* santempi\_santempi-psql-1
