---
description: A Quick start.
---

# Getting started

### Hardware Requirements

A machine that has 24 RAM is advised, less than that may cause performance issues.&#x20;

### Software Requirements

The following tools are needed to run/deploy the stack:

* [Git CLI](https://git-scm.com/book/en/v2/Getting-Started-The-Command-Line)
* [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) (for windows users)&#x20;
* [Docker](https://docs.docker.com/engine/install/)

You will need first to clone the project on your machine.

{% hint style="info" %}
* If you're a _**W**_**indows user,** you should limit the amount of RAM/CPU that will be used by WSL, for more details please check the following link: [Limiting memory usage in WSL2](https://www.aleksandrhovhannisyan.com/blog/limiting-memory-usage-in-wsl-2/).
* You should run the following command to initialize docker swarm on your machine: `docker swarm init.`
{% endhint %}

### Prerequisites

* [Docker Swarm](https://docs.docker.com/engine/swarm/)
* [Terraform](https://www.terraform.io/) (for remote deployments to AWS only)
* [Ansible](https://www.ansible.com/) (for remote deployments only)
* [Platform Cli](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/TwrbQZir3ZdvejunAFia/)

### What is Cares on Platform?&#x20;

Cares on Platform aims to provide a set of services working together to consume raw COVID data in FHIR format in order to produce reports and visualizations.&#x20;

This service will use, transform, and flatten the data to get the expected output and produce reports.&#x20;

It is aimed to be working in Single mode as well as Cluster mode with the ability to handle big data.

It is an implementation of the general project [Platform](https://github.com/jembi/platform) and it is developed to act as a **custom package** alongside some of the base packages in the Platform.

### What should I know before starting to develop?

It is advised to take a look at [Platform CLI](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/TwrbQZir3ZdvejunAFia/) docs, as well as [Jembi Platform](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/ozRkSu9v4EJR8LJ8nFIv/) docs to understand the basics of the CLI and the packages used in this project.

### Quick Start for Devs

The following steps provide a quick start to Cares on platform:

1. Clone the [GitHub repository for the project](https://github.com/jembi/cares-disi-on-platform).
2. In your terminal, navigate to the project root directory and run the command: `./get-cli.sh` to download the [platform-cli](https://app.gitbook.com/o/lTiMw1wKTVQEjepxV4ou/s/TwrbQZir3ZdvejunAFia/) executable for your operating system`[linux|windows|macos].`\
   ``Example: `./get-cli.sh linux`  to download the binary for use on Linux.
3. According to your arguments provided in the first command, it downloads one or three executable files `platform-linux | platform-macos | platform.exe`. \
   Now you should edit the command in the `deploy-local.sh` file. It should make use of the executable suitable for your operating system (the default: `platform-linux`).
4. Ensure docker is installed on your machine, and run the command `docker swarm init` to initialize a docker swarm.
5. To start up the project run the command`./deploy-local-combo.sh init` .

The following options can be passed to the `./deploy-local-combo.sh` command:

* `init` for initializing the services
* `down` for stopping the services
* `up` for bringing the services up
* `destroy` for removing the services&#x20;

### What I expect to see ?&#x20;

Running the deploy-local.sh script will spin up the services. \
You can run: `docker service ls` to view the current running services.

You can check the sub-section [local-deployment.md](deployment/local-deployment.md "mention") to check the expected running services.

### Need more info ?&#x20;

You can check the [overview](overview/ "mention") section for more understanding.

For more info on components and services, view [design-and-architecture](design-and-architecture/ "mention").

The section [launching-and-local-testing](launching-and-local-testing/ "mention") will detail which services should be up and running and how to test all the flow.&#x20;

The section [troubleshooting-and-monitoring](troubleshooting-and-monitoring/ "mention")will explain the steps to locate and issue if you're facing one.

The section [deployment](deployment/ "mention") will mention more options for starting the stack.
