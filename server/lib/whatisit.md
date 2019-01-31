# Java Libraries for use in webelexis server

For some tasks we need java libraries (see src/util/elexis-types.ts for more information.)

These are:

* rgw-toolbox-x.y.z.jar
* jackson-core-x.y.z.jar
* jackson-annotations-x.y.z.jar
* jackson-databind-x.y.z.jar

You can grab them from wherever you want (r.g. bintray or maven central) and place them in this directory. Or maybe they are already in your local maven repository (~/.m2/repository).

To simplify things, I made a pom.xml. So you may just type:

    mvn dependency:copy-dependencies -DoutputDirectory=.

This will fetch more libraries than needed for webelexis, though. You can delete all but the above named.

The shell script fetch.sh automates all that. You just need Maven 3.3 or higher, and there you go.

