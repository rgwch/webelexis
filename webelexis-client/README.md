# Webelexis Client

## Build from scratch

1. install nodejs and npm
2. install git
2. sudo npm install -g mimosa
3. git clone https://github.com/rgwch/webelexis.git webelexis
4. cd webelexis/webelexis-client
5. mimosa build (or: mimosa watch)

Note: This does not run the vertx-server. You can run a simple server in dist for client-only testing purposes, e.g.

    mimosa watch -s  # and point your browser to localhost:3000
    
or you run the vertx-server separately:

    vertx runmod rgwch~webelexis-server~0.5.0 -conf &lt;yourconfig.json>

The module resides on bintray, so vertx will find and download it automagically. In &lt;yourconfig.json>, make sure that the 'webroot'-key in the section 'bridge' points to your development client, e.g. 

    "bridge":{
        "webroot": "../../webelexis-client/dist" 
    }

if you did not change the layout of the subprojects within webelexis. Please look [here](https://github.com/rgwch/webelexis/wiki/Build) for more informations on configuring and running the webelexis server.

