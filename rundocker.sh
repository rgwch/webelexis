#!/bin/bash

docker stop webelexis
docker rm webelexis
docker run -p 3030:3030 -p 4040:4040 --name webelexis --network external_webelexis_net -v `pwd`/data:/home/node/webelexis/data -v `pwd`/server/config:/home/node/webelexis/server/config rgwch/webelexis:`cat VERSION`
