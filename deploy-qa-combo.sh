#!/bin/bash

./platform-linux "$1" -c="../cares-on-platform" -c="git@github.com:jembi/disi-on-platform.git" --env-file="./.env.qa-combo" cares-on-platform disi-on-platform
