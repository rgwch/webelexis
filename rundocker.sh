#!/bin/bash

docker rm webelexis
docker run -p 3031:3030 -p 4041:4040 --name webelexis -v `pwd`/data:/home/node/webelexis/data -v `pwd`/server/config:/home/node/webelexis/server/config rgwch/webelexis:`cat VERSION`
