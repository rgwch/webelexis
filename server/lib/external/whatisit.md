# Launch servers

This docker-compose.yaml launches additional servers for the webelexis-Server:

- The elexis database server (wlx_elexisdb)
- Lucinda (wlx_lucinda)
- Tika (wlx_tika)
- Solr (wlx_solr)
- CouchDB (wlc_couchdb)

Just call `docker-compose up` or `docker-compose up&` in dthis directory

use etcd_backup.sh to create a snapshot of the current data in etcd
