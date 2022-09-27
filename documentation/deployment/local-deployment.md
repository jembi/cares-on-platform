# Local deployment

To deploy locally, you can follow the sections:&#x20;

* [launch-cares.md](../launching-and-local-testing/launch-cares.md "mention"): to start cares-on-platform only
* [launch-cares-and-disi.md](../launching-and-local-testing/launch-cares-and-disi.md "mention"): to start Cares + Disi

The necessary services that should be up and running after launching:&#x20;

* instant\_analytics-datastore-clickhouse
* instant\_dashboard-visualiser-superset
* instant\_kafdrop
* instant\_kafka
* instant\_kafka-mapper-consumer
* instant\_kafka-unbundler-consumer
* instant\_zookeeper-1

If launching cares only, some additional services should exist:&#x20;

* instant\_hapi-proxy
* instant\_hapi-fhir&#x20;
* instant\_mongo-1&#x20;
* instant\_openhim-console
* instant\_openhim-core&#x20;
* instant\_postgres-1

If launching cares + disi, the following services should be up as well:&#x20;

* instant\_analytics-datastore-elastic-search
* instant\_dashboard-visualiser-jsreport
* instant\_dashboard-visualiser-kibana
* instant\_hapi-fhir&#x20;
* instant\_mongo-1&#x20;
* instant\_openhim-console
* instant\_openhim-core&#x20;
* instant\_postgres-1
* instant\_santedb-mpi&#x20;
* instant\_santedb-www
* instant\_santempi-psql-1
