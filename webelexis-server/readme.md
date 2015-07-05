## Webelexis Server

Starting with Version 1.0, Webelexis Server is based on vert.x 3.0. The main differences are:

* No more modules. All server parts come within the same application
* Embedded mode. While this was not enforced by vert.x, it makes things easier: Webelexis Server now is a plain old java program, easy to
debug and to run in different environments. The main class is ch.webelexis.Runner.
* Default deployment is a fat-jar with all dependencies included.

### Setup

#### 1. Install Build prerequisites

* Java 8
* Maven v 3.x
* nodejs/npm

#### 2. Build

     git clone https://github.com/rgwch/webelexis
     sudo npm install -g mimosa
     cd webelexis/webelexis-server
     mvn package
    
#### 3. Run Webelexis-Server first time

     cd target
     java -jar webelexis-server-x.y.z.jar
    
On first run, webelexis will write a file called cfglocal.json for you and terminate with an error message.

Edit cfglocal.json with your favourite text editor to match your setup. 


#### 4. Normal run

If you run `java -jar webelexis-server-x.y.z.jar` without parameters, it will look for cfglocal.json in the current directory. If found, 
it will use this configuration file. If not found, it will write a file with default values and exit.

You'll probably want to copy your customized cfglocal.json to a safer place where it won't get deleted with the next `mvn clean`. You might move it to the webelexis-server base directory.

Then you can launch webelexis from the target dir with: `java -jar webelexis-server-x.y.z.jar ../cfglocal.json` 

If you provide a config file on the command line, webelexis will ignore any other configuration. Any options not set in the config will have the same default values as shown in the automatically created cfglocal.json above.


    
    
