---
description: Sending data and not getting a result in Superset or Clickhouse ?
---

# Locate the issue

After sending data, it is expected to see the output data either in Superset (dashboard with increasing numbers in the charts, or in the SQL Lab of Superset with running some queries).&#x20;

in DEV mode, the output data can be checked by running a SQL query in the provided playground.&#x20;

Not getting the expected data may be caused by many hypothesis.&#x20;

In this page, we're going to proceed by giving steps to locate the issue.&#x20;

### Response of Hapi-FHIR

The service hapi-fhir is the first validator, if there is issues in the validation of the input data (fhir resources) you will get an error and you can check that by checking openHIM transactions response status and response body.

### Wrong input data&#x20;

It is common that the incoming data is not structured as expected, or there is some missing fields.\
Not only hapi-fhir, but also other services are waiting for a certain structure and changing or missing that structure will be rejected by the internal services such as kafka-mapper-consumer or Clickhouse database.&#x20;

A first step is to check if the incoming data is correct by checking openHIM transactions. You can there download the full request body and check your data.

For more detail, the mapping of each resource may be found in the folder `importer -> kafka-mapper-consumer.`

### Logs&#x20;

Checking the docker logs will indicate which service is failing.&#x20;

Error messages may provide you with the problem causing the data to stop there.&#x20;

You can also read the logs of kafka-mapper-consumer to see which data is going to be inserted in Clickhouse. Sometimes a difference between expected data type in Clickhouse and the one inserted may throw errors.

If there is no logs, you may need to check if the config importers of all the services was launched and finished successfully, and if the channels in openHIM are defined correctly.

Other common issues is that the docker image wasn't installed. You can check your images with running this command: `docker image ls`.

You can check also for failing docker containers and if there is any issues with communication between the containers.&#x20;

In certain cases, it is best to bring down the stack and init it again and you can keep an eye on all the logs.



In case the issue still persistent, you can create an issue in Github or contact us.
