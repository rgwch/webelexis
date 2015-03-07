# Webelexis-base

## build process

After trying quite a few build tools (ant, maven, gradle, grunt, gulp), I finally returned to a radically simplified method: npm.
The reasons are about the same as stated [here](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/). Npm offers slightly more help in organising build subtasks, but essentialla acts as a starter for command line tools. More on this topic [here](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). A [package.json](http://browsenpm.org/package.json) is all, npm needs to run.

### Prerequisites

[npm](https://www.npmjs.com) while being primarly a package manager for node.js, it is useful for many tasks, especially finding and installing javascript utilities. You can install it by itself, or via the node.js installer. On [Homebrew](http://brew.sh)-enabled Mac: Simply type:
    
    brew install node
    
This will install npm as well.  On Debian-/Ubuntu like linuxes, try:

	sudo apt-get install python-software-properties
	sudo apt-add-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs

_Warning: "`apt-get install nodejs`" from the original ubuntu repository (i.e. WITHOUT previously adding chris lea's PPA) did not work on my system. Instead it produced a "weird error" (indeed, this was npm's error message)._

	

On other systems, refer to the documentation of node.js on how to install node and npm.

Then continue with:

    npm install -g jade
    npm install -g requirejs
    npm install -g marked

(on some systems, you'll have to prepend each line with "sudo", as in: 'sudo npm install -g jade')

check out webelexis

	git clone https://github.com/rgw.ch/webelexis

Try it out with:
    
	cd webelexis/webelexis-base
	npm run build:client

And point your favorite browser to dist/web/index.html. Of course, not much will happen here. But if everything was okay, you should see the main-menu structure of webelexis.

### Folder layout

- src/** 
    * src/main/ - everything that gets processed and goes into the final distribution
    * src/main/web - the raw (unprocessed) contents of the website.
    
- dist/**
    * dist/web - The contents of the resulting website
    
### Build tasks

* npm run  - overview over defined tasks
* npm run env  - overview over the build environment
* npm run clean - remove the "dist" folder and all subdirs
* npm run build:client - create the clients side of the webelexis project and copy all to the "dist/web" folder
