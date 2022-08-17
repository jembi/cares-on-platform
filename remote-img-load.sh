#!/bin/bash

readonly HOST="$1"
if [ -z "${HOST}" ]; then
  echo "Usage: ./remote-img-load.sh <host>"
  exit 1
fi

./build-image.sh
echo "Transfering image to ${HOST} ..."
docker save jembi/cares-on-platform:latest | bzip2 | ssh ubuntu@"${HOST}" docker load
echo "Image transfered"
