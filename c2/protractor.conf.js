const CLIOptions = require('aurelia-cli').CLIOptions;
const aureliaConfig = require('./aurelia_project/aurelia.json');
const cliOptions = new CLIOptions();

Object.assign(cliOptions, {
  args: process.argv.slice(3)
});

const port = cliOptions.getFlagValue('port') || aureliaConfig.platform.port;
const host = cliOptions.getFlagValue('host') || aureliaConfig.platform.host || "localhost";
const headless = cliOptions.hasFlag('headless');

const config  = {
  port: port,
  host: host,
  baseUrl: `http://${host}:${port}/`,

  specs: [
    '**/*.e2e.ts'
  ],

  exclude: [],

  framework: 'jasmine',

  allScriptsTimeout: 110000,

  jasmineNodeOpts: {
    showTiming: true,
    showColors: true,
    isVerbose: true,
    includeStackTrace: false,
    defaultTimeoutInterval: 400000
  },

  SELENIUM_PROMISE_MANAGER: false,

  directConnect: true,

  capabilities: {
    'browserName': 'chrome',
    'chromeOptions': {
      'args': [
        '--show-fps-counter',
        '--no-default-browser-check',
        '--no-first-run',
        '--disable-default-apps',
        '--disable-popup-blocking',
        '--disable-translate',
        '--disable-background-timer-throttling',
        '--disable-renderer-backgrounding',
        '--disable-device-discovery-notifications'
      ]
    }
  },

  onPrepare: function() {
    require('ts-node').register({ compilerOptions: { module: 'commonjs' }, disableWarnings: true, fast: true });
  },

  plugins: [{
    package: 'aurelia-protractor-plugin'
  }],
};

if (headless) {
  config.capabilities.chromeOptions.args.push("--no-gpu");
  config.capabilities.chromeOptions.args.push("--headless");
}

exports.config = config;
