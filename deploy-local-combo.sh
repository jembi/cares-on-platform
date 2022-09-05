#!/bin/bash

./platform-linux "$1" -c="../cares-on-platform" -c="git@github.com:jembi/disi-on-platform.git" --dev --env-file="./.env.local-combo" cares-on-platform
