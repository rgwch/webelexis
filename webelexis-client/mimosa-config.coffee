exports.config =
  minMimosaVersion:'2.0.0'

  modules: [
    'server'
    'require'
    'minify-js'
    'minify-css'
    'minify-html'
    'coffeescript'
    'live-reload'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'csslint'
    'jshint'
    'copy'
    'testem-require'
    'jade'
    'client-jade-static'
  ]

  watch:
    sourceDir: 'src'
    compiledDir: 'dist'
    javascriptDir: 'js/app'

  vendor:
     javascripts: 'js/lib'


  clientJadeStatic:
    outputExtension: 'html',
    extensionRegex: /\.jade$/,
    prettyOutput: false

  jade:
    compileOptions:
      compileDebug: false

  requireBuildTextPluginInclude:
    pluginPath: 'text'
    extensions: ['html']

  requireBuildInclude:
    folder:"js"
    patterns: ['app/**/*.js', 'lib/durandal/**/*.js']

  bower:
    bowerDir:
      clean: false
    copy:
      mainOverrides:
        "durandal": [
          {
            img: "../../images"
            js: "durandal"
            css: "durandal"
          }
        ],
        "i18next": [
          "i18next.amd.withJQuery.js"
        ]



  combine:
    sourceMap: true
    folders: [
      {
        folder:'stylesheets'
        output:'stylesheets/styles.css'
        order: [
          'vendor/bootstrap/bootstrap.css'
          'vendor/bootstrap/bootstrap-responsive.css'
          'vendor/font-awesome/font-awesome.css'
          'vendor/durandal/durandal.css'
          'starterkit.css'
          'webelexis.css'
        ],
        exclude: [
          "vendor/bootstrap/bootstrap.min.css",
          "vendor/bootstrap/bootstrap-theme.css",
          "vendor/bootstrab/bootstrap-theme.min.css",
          "vendor/font-awesome/font-awesome.min.css"
        ]
      }
    ]
    removeCombined: {
      enabled: true
    }

  server:
    defaultServer:
      enabled: true
      onePager: true
    views:
      compileWith: 'jade'
      extension: 'html.jade'
      path: "src"



  require:
    commonConfig: 'js/app/requirejs.config.js'
    optimize:
      overrides:
        name: '../lib/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true

  testemRequire:
    executeDuringBuild: false
    executeDuringWatch: false
    safeAssets: []
    requireConfig:
      "paths": {
        "bootstrap": "/lib/bootstrap/bootstrap",
        "jquery": "../lib/jquery/jquery",
        "jquery-ui": "../lib/jquery-ui/jquery-ui",
        "validate": "../lib/jquery-validate/jquery.validate",
        "knockout": "../lib/knockout/knockout",
        "sockjs": "../lib/sockjs/sockjs",
        "text": "../lib/requirejs-text/text",
        "vertxbus": "../lib/vertxbus/vertxbus",
        "knockout-jqueryui": "../lib/knockout-jqueryui/knockout-jqueryui",
        "cookie": "../lib/js-cookie/js.cookie",
        "durandal": "../lib/durandal",
        "plugins": "../lib/durandal/plugins",
        "transitions": "../lib/durandal/transitions",
        "i18n": "../lib/i18next/i18next.amd.withJQuery",
        "bus": "eb",
        "spark": "https://cdnjs.cloudflare.com/ajax/libs/jquery-sparklines/2.1.2/jquery.sparkline.min",
        "underscore": "../lib/underscore/underscore",
        "flot": "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.min",
        "flot-time": "https://cdnjs.cloudflare.com/ajax/libs/flot/0.8.3/jquery.flot.time.min",
        "cke": "../lib/ckeditor/ckeditor",
        "smooth": "../lib/flot.curvedlines/curvedLines"
      },
      "shim": {
        "bootstrap": {
          "deps": [
            "jquery"
          ]
        },
        "knockout": {
          "deps": [
            "jquery"
          ]
        },
        "validate": {
          "deps": [
            "jquery"
          ]
        },
        "flot-time": {
          "deps": [
            "flot"
          ]
        },
        "smooth": {
          "deps": [
            "flot"
          ]
        },
        "cke": {
          "deps": [
            "jquery"
          ]
        }
      }
