# Launch servers

This docker-compose.yaml launches additional servers for the webelexis-Server:

- The elexis database server (elx_elexisdb)
- Lucinda
- Tika
- Solr
- etcd

Just call `docker-compose up` or `docker-compose up&` in dthis directory

use etcd_backup.sh to create a snapshot of the current data in etcd