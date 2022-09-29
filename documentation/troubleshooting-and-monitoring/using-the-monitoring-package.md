---
description: Monitor your services.
---

# Using the Monitoring package

Launching the Cares or Cares+Disi with the Monitoring package will give a lot of insights about the metrics of the running services.&#x20;

CPU usage, memory usage and network usage of each service will all be in a very intuitive Grafana dashboard to monitor and check for issues.&#x20;

To run the Montoring package you can add the name of the package to the launching command inside either `deploy-local.sh` or `deploy-local-combo.sh`:&#x20;

{% code title="deploy-local.sh" overflow="wrap" %}
```
./platform-linux "$1" -c="../cares-on-platform" -c="../disi-on-platform" --dev --env-file="./.env.local-combo" cares-on-platform disi-on-platform monitoring
```
{% endcode %}

{% code title="deploy-local-combo.sh" overflow="wrap" %}
```
./platform-linux "$1" -c="../cares-on-platform" -c="../disi-on-platform" --dev --env-file="./.env.local-combo" cares-on-platform disi-on-platform monitoring
```
{% endcode %}
