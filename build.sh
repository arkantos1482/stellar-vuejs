#!/bin/bash

set -ex

TAG=$1

IMAGE=registry.digitalocean.com/bitra/bitra-web-ui:$TAG

docker build . -t $IMAGE

docker push $IMAGE
