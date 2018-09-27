# !/bin/sh

rm *.jar
mvn dependency:copy-dependencies -DoutputDirectory=.
rm netty-*
rm bcp*
rm junit*
rm kotlin*
rm vertx*
rm hamc*
rm jdom*
