#! /bin/bash

docker rm webelexis
docker run -d -p 2016:3000 --name webelexis -v `pwd`/Janus/config.json:/usr/src/app/Janus/config.json rgwch/webelexis:2.0.5
