exports.config =
  minMimosaVersion:'2.0.0'

  modules: [
    'server'
    'require'
    'minify-js'
    'minify-css'
    'live-reload'
    'combine'
    'requirebuild-include'
    'requirebuild-textplugin-include'
    'bower'
    'csslint'
    'jshint'
    'copy'
    'jade'
    'client-jade-static'
  ]

  watch:
    sourceDir: 'src'
    compiledDir: 'dist'
    javascriptDir: 'js/app'

  vendor:
     javascripts: 'js/lib'


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
        "font-awesome": [
          {
            css: "stylesheets"
          }
        ],
        "jqueryui-datepicker": [
          "datepicker.js",
          "core.js",
          {
            js: "jquery-ui"
            css: "jquery-ui"
          }
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
        ]
      }
    ]

  server:
    defaultServer:
      enabled: true
      onePager: true
    views:
      compileWith: 'html'
      extension: 'html'

  require:
    commonConfig: 'js/app/requirejs.config.js'
    optimize:
      overrides:
        name: '../lib/almond-custom'
        inlineText: true
        stubModules: ['text']
        pragmas:
          build: true
