#!/bin/bash
TAG_NAME=${1:-latest}

PlatformVersion=$(docker run --rm -v "${PWD}":/workdir mikefarah/yq:4.24.5 '.platformVersion' "config.yml")

docker build -t jembi/cares-on-platform:"$TAG_NAME" --build-arg PLATFORM_VERSION="$PlatformVersion" .
