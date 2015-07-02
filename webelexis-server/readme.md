## Webelexis Server

Starting with Version 1.0, Webelexis Server is based on vert.x 3.0. The main differences are:

* No more modules. All server parts come within the same application
* Embedded mode. While this was not enforced by vert.x, it makes things easier: Webelexis Server now is a plain old java program, easy to
debug and to run in different environments. The main class is ch.webelexis.Runner.
* Default deployment is a fat-jar with all dependencies included.

### Setup

#### 1. Install Java 8

Webelexis 1.x depends on Java 8 language features. I you want to develop, you'll need the JDK, For Run-Only, the JRE is enough.
If you want only to run webelexis, just download webelexis-server-x.y.z.jar and continue with step 3.

#### 2. Install Build prerequisites and download Webelexis sources

* Install Maven (3.x)
* Install npm
 
Then build the .jar

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

If you run `java -jar webelexis-server-x.y.z.jar` without parameters, it will look for cfgloca.json in the current directory. If found, 
it will use this configuration file. If not found, it will write a file with default values and exit.

You can still provide a different file as command line parameter: `java -jar webelexis-server-x.y.z.jar otherconfig.json` 
will use 'otherconfig.json' as configuration file.


    
    
