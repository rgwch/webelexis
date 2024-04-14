#! /bin/bash
#docker builder prune -f
docker build -t rgwch/webelexis:`cat VERSION` .
