# Webelexis-base

## build process

After trying quite a few build tools, I finally returned to a radically simplified method: npm.
The reasons are about the same as stated [here](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/). Npm offers slightly more help in organising build subtasks, but essentially acts as a starter for command line tools. More on this topic [here](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). A [package.json](http://browsenpm.org/package.json) is all, npm needs to run.

### Prerequisites

Check the Build Environment for [Mac](https://github.com/rgwch/webelexis/wiki/Build-environment:-MacOS-X-10.10), [Manjaro Linux](https://github.com/rgwch/webelexis/wiki/Build-environment:-Manjaro-Arch-Linux), or [Ubuntu/Debian](https://github.com/rgwch/webelexis/wiki/Build-environment:-Ubuntu-Debian-Linux) to install the tools needed.

On other systems, refer to the documentation of node.js on how to install the respective tool chain

### Create and launch!

Checkout webelexis and let npm fetch and install all you need:
	  
	  git clone https://github.com/rgwch/webelexis
	  cd webelexis/webelexis-base
	  npm install	# This might take quite a long time on first run
    
Try it out with:
    
	npm run build:client

And point your favorite browser to dist/web/index.html. Of course, not much will happen here. But if everything was okay, you should see the main-menu structure of webelexis.

If this works, copy `webelexis-base/src/main/resources/config_sample.json` or `config_minimal.json` to `webelexis-base/cfglocal.json`. Edit the entries to match your system, but make sure to have a valid json-file. 

Then check if launching the whole system works:

     npm start
     
This will first run build:client, then build and launch the server. You should then be able to point your browser to `localhost:2015`and see the life version auf webelexis (which is not much at this time).


    
### Folder layout

- src/** 
    * `src/main/` - everything that gets processed and goes into the final distribution
    * `src/main/web` - the raw (unprocessed) contents of the website.
    * `src/main/web/app` - the javascript source files - will processed and written to `dist/web/app`.
    * `src/main/web/components` - folders with webelexis components, each consisting of at least a `*.js` and a `*.jade` file. JavaScript files will be processed and placed to `dist/web/components/*`, while the jade files will be compiled to `dist/web/tmpl/*.html`
    * `src/main/web/css/*, fonts/*, img/*, lib/*` - will all copied to respective directories in dist/web
    * `src/main/java` - java source files. will be compiled to `dist/*`
    
    
- dist/**
    * dist/web - The contents of the resulting website
    
    
### Build tasks

* npm run  - overview over defined tasks
* npm run env  - overview over the build environment
* npm run clean - remove the "dist" folder and all subdirs
* npm run build:client - create the clients side of the webelexis project and copy all to the "dist/web" folder
* npm run verticle - copy and run the server side application
* npm start - rebuild all and start the server ($VERTX_HOME must be set correctly)
* npm run build:module - create and install ch.webelexis~base-module~x.y.z as a vert.x module in the system ($VERTX_HOME and $VERTX_MODS must be set correctly)
* npm run build:jar - create a self-contained jar (needs no vertx installation to run)
* npm run build:zip - create a fat jar as before, and create a zipped module (can be run with `vertx runzip <name>`
