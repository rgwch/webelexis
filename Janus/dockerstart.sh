#!/usr/bin/env bash

# Set timezone - quite a dirty hack. But since litererally all users are situated in Switzerland...

cp /usr/share/zoneinfo/Europe/Zurich /etc/localtime

# Launch the Mongo server detached. This will take several seconds. Write a pid-file when ready.
mongod  --pidfilepath /var/run/mongodb/mongo.pid --fork --logpath /var/log/mongod.log

# Wait until the mongo server is up and running

until [ -f /var/run/mongodb/mongo.pid ]
do
        sleep 3
done

# then launch lucinda
java -jar $LUCINDA --config=lucinda.cfg -d &

# then launch Janus
node ./bin/www

