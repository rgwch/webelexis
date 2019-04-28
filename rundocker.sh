#!/bin/bash

docker rm webelexis
sudo docker run -p 3031:3030 -p 4041:4040 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:`cat VERSION`
