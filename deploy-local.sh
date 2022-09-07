#!/bin/bash

./platform-linux "$1" -c="../cares-on-platform" --dev --env-file="./.env.local" cares-on-platform
