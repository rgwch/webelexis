#!/bin/bash

docker rm webelexis
sudo docker run -p 80:3030 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:`cat VERSION`
