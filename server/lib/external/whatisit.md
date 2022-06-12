# Launch servers

This docker-compose.yaml launches additional servers for the webelexis-Server:

- The elexis database server (wlx_elexisdb)
- Lucinda (wlx_lucinda)
- Tika (wlx_tika)
- Solr (wlx_solr)
- CouchDB (wlc_couchdb)

Note: You'll probably want to set up different directories for Lucinda documents and Solr data. You can do so by setting the environment variables LUCINDA_DOCBASE and SOLR_DATA before launching docker-compose. You can also set these variables in a file `.env` in this directory like so:

```
LUCINDA_DOCBASE=/home/myname/webelexis/documents
SOLR_DATA=/home/myname/webelexis/solr
``` 

BUT: you must make sure that a user 8983:8983 has write access to the solr-directory. Either by making it world-writable or by creating such a user.

Just call `docker-compose up` or `docker-compose up&` in this directory

