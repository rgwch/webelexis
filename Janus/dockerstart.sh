#!/usr/bin/env bash

mongod  --pidfilepath /var/run/mongodb/mongo.pid --fork --logpath /var/log/mongod.log

# Wait until the mongo server is up and running

until [ -f /var/run/mongodb/mongo.pid ]
do
        sleep 3
done

# then launch Janus

node ./bin/www

