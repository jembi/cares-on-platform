---
description: Good to know.
---

# A Custom package

What is additional in this project ?&#x20;

Cares on platform is a custom package and has exactly the same structure as any other package in the Platform (A swarm script, a package-metadata.json file, and docker-compose file).

The deploy bash script that will launch the project is in reality going to launch Platform and additionally informing the platform that it should run the cares-on-platform package with its dependencies:

```
// deploy-local.sh script
./platform-linux "$1" -c="../cares-on-platform" --dev --env-file="./.env.local" cares-on-platform
```

More reading about the platform CLI is this link: [Platform CLI](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/TwrbQZir3ZdvejunAFia/ "mention").

Cares on platform will need the packages mentioned in the `package-metadata.json,` in the depedencies section:&#x20;

<figure><img src="../.gitbook/assets/image (3) (1).png" alt=""><figcaption><p>package-metadata.json file of cares-on-platform</p></figcaption></figure>

Each package mentioned above will have dependencies as well.

Running the cares on platform will result on running these packages as well as the dependencies of these packages.

Another example from Platform:&#x20;

<figure><img src="../.gitbook/assets/image (4).png" alt=""><figcaption><p>package-metadata.json of dashboard-visualiser-superset in Platform</p></figcaption></figure>

In result, the packages cares-on-platform, analytics-datastore-clickhouse and dashboard-visualiser-superset will run in this order:&#x20;

1. analytics-datastore-clickhouse
2. dashboard-visualiser-superset
3. cares-on-platform

NOTE: cares-on-platform package will be running last.
