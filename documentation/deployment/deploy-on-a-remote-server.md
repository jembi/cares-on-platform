# Deploy on a Remote Server

To deploy on a remote server, you should follow the two steps:&#x20;

#### 1. Edit the .env.\* and edit the following fields:

\- OPENHIM\_CORE\_MEDIATOR\_HOSTNAME_= \<OPENHIM\_SUBDOMAIN> (default localhost)_\
_-_ DOMAIN\_NAME= _\<DOMAIN\_NAME> of remote server_\
_-_ SUBDOMAINS= _\<SUBDOMAINS OF ALL EXPOSED SERVICES>_&#x20;

You may need to update the memory and CPU limit according to the server.

Example:&#x20;

{% code overflow="wrap" %}
```
OPENHIM_CORE_MEDIATOR_HOSTNAME=openhimcomms.domain.com
DOMAIN_NAME=domain.com
SUBDOMAINS=openhimcomms.domain.com,openhimcore.domain.com,openhimconsole.domain.com,kibana.domain.com,reports.domain.com,superset.domain.com,santempi.domain.com,santewww.domain.com
```
{% endcode %}

#### 2. Run the following command to deploy Cares and Disi:&#x20;

```
DOCKER_HOST=ssh://<username>@<host> ./deploy-local-combo.sh init 
```

With:&#x20;

* username: is the user of the remote server
* host: is the domain name or the IP address of the remote server.
