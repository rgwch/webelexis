var allTestFiles = [];
var TEST_REGEXP = /(spec|test)\.js$/i;

var pathToModule = function(path) {
  return path.replace(/^\/base\//, '').replace(/\.js$/, '');
};

Object.keys(window.__karma__.files).forEach(function(file) {
  if (TEST_REGEXP.test(file)) {
    // Normalize paths to RequireJS module names.
    allTestFiles.push(pathToModule(file));
  }
});

require.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',
  paths: {
    "bootstrap": "dist/web/lib/bootstrap.min",
    "jquery": "dist/web/lib/jquery.min",
    "jquery-ui": "dist/web/lib/jquery-ui",
    "knockout": "dist/web/lib/knockout",
    "sockjs": "dist/web/lib/sockjs.min",
    "text": "dist/web/lib/text",
    "vertxbus": "dist/web/lib/vertxbus",
    "knockout-jqueryui": "dist/web/lib/knockout-jqueryui",
    "underscore": "dist/web/lib/underscore-min",
    "bus": "src/test/resources/ebmock",
    "app": "dist/web/app",
    "flot": "dist/web/lib/jquery.flot.min",
    "flot-time": "dist/web/lib/jquery.flot.time.min",
    "smooth": "dist/web/lib/curvedLines",
    "components": "dist/web/components",
    "tmpl": "dist/web/tmpl",
    "partials": "dist/web/partials"
  },
  shim: {
    "bootstrap": {
      deps: ["jquery", "text"]
    },
    "knockout": {
      deps: ["jquery", "text"]
    },
    "flot-time":{
      deps: ["flot"]
    },
    "smooth":{
      deps:["flot"]
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  callback: window.__karma__.start
});
