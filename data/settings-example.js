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
  /* If the user database is empty, create an admin and assign this pasword. Make sure to remove the line
     after the first start. */
  adminpwd: "topsecret",
  /* create a proxy server at :4040 for appointment-self-service requests */
  self_service: true,
  /* A list of mandators and metadata for them. Metadata are used in templates. You can define whatever you want
     and refer to it e.g. in 'briefe' templates. See data/sample-docbase/templates/rezept.pug for an example. */
  mandators: {
    default: {
      name: "Dr. med. Dok Tormed",
      subtitle: "Facharzt für Webelexik",
      street: "Hinterdorf 17",
      place: "9999 Webelexikon",
      phone: "555 55 55",
      email: "doc@webelexis.org",
      zsr: "G088113",
      gln: "123456789012"
    }
  },
  /* The place to store templates and documents */
  docbase:"data/sample-docbase",
  /* connection to the database */
  elexisdb: {
    host: "localhost",
    database: "elexis",
    user: "praxis",
    password: "topsecret",
    /* set automodify to true to let webelexis modify the elexis database */
    automodify: false
  },
  /* We need an SMTP host to send mails for lost password retrieval */
  smtp:{
    host: "some.smpt.host",
    port: 587,
    user: "smtpuser",
    pwd: "smtppassword"
  },
  /* Definition of the document store. Can be Lucinda or Solr. Fallback is always
    storage in the file system */
  lucinda:{
    url: "http://localhost:2016/lucinda/2.0"
  }
}

