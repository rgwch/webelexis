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

requirejs.config({
  // Karma serves files under /base, which is the basePath from your config file
  baseUrl: '/base',
  paths: {
    "bootstrap": "dist/js/lib/bootstrap/bootstrap",
    "jquery": "dist/js/lib/jquery/jquery",
    "knockout": "dist/js/lib/knockout/knockout",
    "sockjs": "dist/js/lib/sockjs/sockjs",
    "text": "dist/js/lib/requirejs-text/text",
    "vertxbus": "dist/js/lib/vertxbus/vertxbus",
    "underscore": "dist/js/lib/underscore/underscore",
    "bus": "test/ebmock",
    "app": "dist/js/app",
    "flot": "dist/js/lib/jquery-flot/jquery.flot",
    "smooth": "dist/js/lib/flot.curvedlines/curvedLines",
  },
  shim: {
    "bootstrap": {
      deps: ["jquery", "text"]
    },
    "knockout": {
      deps: ["jquery", "text"]
    },
    "smooth":{
      deps:["flot"]
    }
  },

  // dynamically load all test files
  deps: allTestFiles,

  callback: window.__karma__.start
});
