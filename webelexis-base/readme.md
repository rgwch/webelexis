# Webelexis-base

## build process

After trying quite a few build tools (ant, maven, gradle, grunt, gulp), I finally returned to a radically simplified method: npm.
The reasons are about the same as stated [here](http://blog.keithcirkel.co.uk/why-we-should-stop-using-grunt/). With the big build tools, I used more time for learning the syntax, creating and testing the build scripts, downloading half of the internet, and interpreting cryptic error messages of the build tool, than I needed for writing the webelexis project itself. 

I like to have as much control over the build process as possible. I could use simply a shell script approach, of course. Npm offers slightly more help in organising build subtasks, but essentialla acts as a starter for command line tools. More on this topic [here](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). A [package.json](http://browsenpm.org/package.json) is all, npm needs to run.

### Prerequisites

- [vertx](http://www.vertx.io)
- [npm](https://www.npmjs.com) while being primarly a package manager for node.js, it is useful for many tasks, especially finding and installing javascript utilities. 
- [jade](http://jade-lang.com) A HTML preprocessor. Simplifies the task of writing HTML files. (npm install -g jade)
- [yuicompresser](https://github.com/yui/yuicompressor) A JavaScript/CSS compressor and more. (npm install -g yuicompressor)

### Folder layout

- src/** 
    * src/main/ - everything that gets processed and goes into the final distribution
    * src/main/web - the raw (unprocessed) contents of the website.
    
- dist/**
    * dist/web - The contents of the resulting website
    
### Build tasks

* npm run  - overview over defined tasks
* npm env  - overview over the build environment
* npm run clean - remove the "dist" folder and all subdirs
* npm run build:client - create the clients side of the webelexis project and copy all to the "dist/web" folder
