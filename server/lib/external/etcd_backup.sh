#! /bin/bash

fdate=`date '+%Y-%m-%d-%H%M'`
filename='etcd_backup_'$fdate'.bin'

docker exec -it webelexis_etcd etcdctl snapshot save /tmp/$filename
docker cp webelexis_etcd:/tmp/$filename .
