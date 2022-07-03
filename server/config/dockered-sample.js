module.exports = {
  configname: "dockered",

  /* connection to the database */
  elexisdb: {
    client: "mysql2",
    connection: {
      host: "wlx_elexisdb",
      database: "elexis",
      user: "elexisuser",
      password: "elexis",
      port: 3306
    }
  },
  couchdb: {
    host: "wlx_couchdb",
    port: 5984,
    defaultDB: "webelexis",
    username: "couchadmin",
    password: "pleasechangethis"
  },
  blob: {
    type: "couchdb",
    namespace: "webelexis",
    salt: "thisShouldBeAppSpec",
    indexer: "lucinda",
    pwd: "PleaseChangeThis"
  },
}
