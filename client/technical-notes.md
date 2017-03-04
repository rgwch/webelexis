# Technical Notes

## Project Structure

Below are the technical notes that describe decisions made while setting up the project.  These are typically ones that I have found to be best practices because they allow for conventionally naming and organizing code.  Please feel free to change as meets your requirements.

### Mock API

The project is current broken down to accomodate a mock API.  Everything in this folder should be a json file that gets returned and mimics a JSON response from the server, as per the proposal document.

### src / dist

All source files, minus high level .css files that haven't been converted to SCSS, are in the `src` directory.
You will find .scss files as well that are compiled at build time to .css and are required from files.  This helps with breaking down and scoping the css, to a point.
All files are built and distributed in the `dist` folder.

#### Components

The components directory contains various custom elements that are typically shared in usage throughout the application.  It is encouraged to put shared custom elements or templates here.

#### Models

The models directory contains the classes for the various models that are used through-out the application.  Models should typically be void of any presentation logic or properties that are used when displaying.

#### Resources

The resources directory contains resources which don't fit well in to the other categories.  Currently this includes value converters and custom attributes.  A case could be made for enums to go here as well as opposed to the models directory if we decide to use them.

#### Routes

In the routes directory, you will find a directory for each route.  This is to help guide the structure to continue to nest things which are isolated to routes.  If you start to find models are specific to a route, it's a great place to start creating a new models directory.
Without knowing the long-term plans of the project you can use this loosely and make sure to accomodate your needs here.

#### Services

The services directory currently has the common services of the application.  In here you will find services that act as a data layer, such as `PatientsService`, as well as stateful services such as `DataStore` which maintains data shared around the application.
Currently the session service contains information about the currently logged in user.  It also currently uses `localStorage` to persist user information after login.  To protect the user and the application the server should invalidate the token after a period of time to force a re-log in.

## Configuration

The following are a list of the configuration files that are important to each function -

**TypeScript**
`tsconfig.json`
`tslint.json`
`typings.json`

**JSPM/System.js**
`config.js`

**NPM**
`package.json`

**Gulp**
*gulpfile.js loads all files in the below*
`gulpfile.js`
*all files in*
`build/tasks/*.js`

**Karma**
`karma.conf.js`

**Protractor**
`protractor.conf.js`

**Internationalization**
`locales/**/*.json`

## Testing

Tests are currently set up to run with karma / jasmine.  The tests are written in TypeScript so should have sufficient type safety.
Tests can be run with either any of the following commands -  `gulp test`, `gulp tdd`, or `karma start`.  `gulp tdd` and `karma start` both simply run the tests and watch for changes to tests or src and re-run on each change.

## TypeScript choices

With TypeScript you can go many different routes.  Mainly you can choose the explicit way of doing things, or you can use TS magic to perform things.
For instance, when using constructor inject with Aurelia's Dependency Injection system (or any constructor injection lib) you can map privates there and they will be auto-created for you.  The project is currently set up to support explicit creation of everything.

### TSLint

TSLint is currently enabled.  It will spit out errors that don't meet the requirements as specified in the tslint.json.  Generally the CI / CD process would run the lint task and fail on any issues as a gate to protect the code-base, but this varies from team to team.

### Typings

Typings is currently set up to manage the typings.  The aurelia-i18n/index.d.ts file currently has an open issue

## Editors

Any editor should work for working on the project as-is.  Some require the tsconfig.json to explicitly be at the root of the project, which it currently is.
Most editors usually require a TypeScript Plugin to support autocomplete and error highlighting.  If you are using one that is not getting intellisense at the moment, please let me know and we can look in to it further.

## JSPM / System.js

JSPM and System.js provide one of the most developer-friendly and spec-compliant ways to manage packages and import modules.
JSPM is responsible for managing packages.  JSPM edits the `package.json` file to store dependencies.  After a developer runs `jpsm install` it also creates a `config.js` that is used to tell system.js where to load everything from, as well as any custom configuration.
For instance, `jspm install {{plugin-name}}` or `jspm install npm:{{npm-plugin-name}}` or `jspm install github:{{github-repo}}` will install the plugin and create a `map` entry in the `config.js` that tells system.js where to load the plugin from.
After doing this you can usually `import {ExportedClass} from 'plugin-name'` to get access to the plugin, except for in some obscure cases where no other JSPM users have used the same library previously.
It is important to understand that system.js is in charge of the *run-time dependenices only* and that if you are seeing red squigglies or errors at build-time that is generally a TypeScript issue with missing .d.ts or similar.

## Internationalization

Internationalization(i18n) is provided by a core plugin named `aurelia-i18n`.  The plugin extends `i18next` and is highly modular.  Currently you can see examples of it's usage in most of the templates that display text, including `login.html`.  It is configured through the `locales/{{language-code}}/translation.json` files.  It is currently configured for both English and Spanish text.

# Authentication / Authorization

Here is a good resource explaining auth in Aurelia (and web apps in general, to a point) -

http://aurelia.io/hub.html#/doc/article/aurelia/framework/latest/securing-your-app/2

------  

(This file has been written by Patrick Walters - the project has changed quite a bit since
then, but this is still a good guide.)