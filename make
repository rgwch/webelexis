#! /bin/sh

./version-bump.pl VERSION
rm -rf Janus/public/webapp
cd client
gulp export
cd ../Janus
tsc
cd ../docs
make html
cd ..
docker build -t rgwch/webelexis:2.0.3 .

