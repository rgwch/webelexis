#!/bin/bash

docker rm webelexis
sudo docker run -p 3030:3030 -p 4040:4040 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:`cat VERSION`
