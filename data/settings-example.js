/**
 * Settings example for the webelexis server
 * please move this file to settings.js and
 * change contents to match your system.
 *
 * For a Docker deployment, move this file to your
 * data directory.
 */
module.exports={
  testing: true,
  sitename: "Praxis Webelexis",
  admin: "someone@webelexis.ch",
  docbase:"data/sample-docbase",
  elexisdb: {
    host: "localhost",
    database: "elexis",
    user: "praxis",
    password: "topsecret"
  },
  smtp:{
    host: "some.smpt.host",
    port: 587,
    user: "smtpuser",
    pwd: "smtppassword"
  },
  lucinda:{
    url: "http://localhost:2016/lucinda/2.0"
  }
}

