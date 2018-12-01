#!/bin/bash

docker rm webelexis
docker run -p 3030:3030 --name webelexis -v `pwd`/server/config:/home/node/webelexis/server/config rgwch/webelexis:3
