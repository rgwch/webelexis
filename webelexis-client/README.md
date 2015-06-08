# Webelexis Client

## Setup build environment

1. install nodejs
2. npm install -g bower
2. npm install -g mimosa
3. git clone https://rgwch/webelexis.git webelexis
4. cd webelexis/webelexis-client
5. mimosa build (or: mimosa watch)

Note: This does not run the vertx-server. You can run a simple server in dist for client-only testing purposes, e.g.

    cd dist
    php -S localhost:4000
    
or you run the vertx-server separately:

   vertx runmod rgwch~webelexis-server~0.5.0 -conf <yourconfig.json>

The module resides on bintray, so vertx will find and download it automagically. In <yourconfig.json>, make sure that the 'webroot'-key in the section 'bridge' points to your development client.

