// Karma configuration
// Generated on Thu Mar 19 2015 14:57:58 GMT+0100 (CET)

// http://attackofzach.com/setting-up-a-project-using-karma-with-mocha-and-chai/

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'requirejs', 'chai', 'sinon'],


    // list of files / patterns to load in the browser
    files: [
      'src/test/resources/web/app/test-main.js',
      // 'test-main.js',
      {
        pattern: 'dist/web/**/*.js',
        included: false
      }, {
        pattern: 'src/test/resources/web/**/*.js',
        included: false
      }, {
        pattern: 'dist/**/*.html',
        served: true,
        included: false
      }
    ],


    // list of files to exclude
    exclude: [
      'dist/web/app/main.js',
      'dist/web/app/require.config.js'
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    //browsers: ['PhantomJS'],
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
