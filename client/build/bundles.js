module.exports = {
  "bundles": {
    "dist/app-build": {
      "includes": [
        "[**/*.js]",
        "**/*.html!text",
        "**/*.css!text"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": true,
        "rev": false
      }
    },
    "dist/aurelia": {
      "includes": [
        "aurelia-framework",
        "aurelia-bootstrapper",
        "aurelia-dialog",
        "aurelia-router",
        "aurelia-animator-css",
        "aurelia-templating-binding",
        "aurelia-polyfills",
        "aurelia-templating-resources",
        "aurelia-templating-router",
        "aurelia-loader-default",
        "aurelia-history-browser",
        "aurelia-logging-console",
        "aurelia-validation",
        "aurelia-i18n",
        "i18next-xhr-backend",
        "aurelia-http-client",
        "jquery",
        "bluebird",
        "font-awesome",
        "materialize",
        "moment",
        "moment/locale/de",
        "pikaday"
      ],
      "options": {
        "inject": true,
        "minify": true,
        "depCache": false,
        "rev": false
      }
    },
    "dist/materialize-bundle": {
      "includes": [
        "aurelia-materialize-bridge",
        "aurelia-materialize-bridge/**/*.js",
        "aurelia-materialize-bridge/**/*.html!text",
        "aurelia-materialize-bridge/**/*.css!text"
      ]
    }
  }
};
