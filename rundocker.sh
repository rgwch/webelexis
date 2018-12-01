#!/bin/bash

docker rm webelexis
sudo docker run -p 80:3030 --name webelexis -v `pwd`/server/config:/home/node/webelexis/server/config rgwch/webelexis:`cat VERSION`
