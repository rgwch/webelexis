/**
 * Settings example for the webelexis server
 * please move this file to settings.js and
 * change contents to match your system.
 *
 * For a Docker deployment, move this file to your
 * data directory.
 */
module.exports={
  /* if testing is true, webelexis will create some testusers on startup and allow to login without a password. */
  testing: true,
  /* The name to show on the browser tab */
  sitename: "Praxis Webelexis",
  /* Admin's mail is needed for registering new users and for lost password retrieval */
  admin: "someone@webelexis.ch",
  /* A list of mandators and metadata for them. Metadata are uses in templates. You can define whatever you want
     and refer to it e.g. in 'briefe' templates. See data/sample-docbase/templates/rezept.pug for an example. */
  mandators: {
    chefe: {
      name: "Dr. med. Dok Tor",
      street: "Hinterdorf 17",
      place: "9999 Webelexikon",
      phone: "555 55 55",
      email: "chefe@webelexis.org",
      zsr: "G088113",
      gln: "123456789012"
    }
  },
  docbase:"data/sample-docbase",
  elexisdb: {
    host: "localhost",
    database: "elexis",
    user: "praxis",
    password: "topsecret",
    automodify: false
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

