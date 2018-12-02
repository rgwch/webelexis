FROM node:alpine
RUN apk add openjdk8 bash git

RUN apk add --no-cache --virtual build_deps python \
  g++ gcc make binutils-gold

RUN npm install -g aurelia-cli \
  && ln -s /usr/lib/jvm/java-1.8-openjdk/bin/javac /usr/bin/javac


USER node
WORKDIR /home/node

RUN git clone https://github.com/rgwch/webelexis \
  && cd webelexis/client \
  && npm install \
  && au build --env prod \
  && cd ../server \
  && npm install \
  && npm install java

ADD https://bintray.com/rgwch/maven/download_file?file_path=rgwch%2Frgw-toolbox%2F4.2.7%2Frgw-toolbox-4.2.7.jar \
  /home/node/webelexis/server/lib/rgw-toolbox-4.2.7.jar
ADD https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-annotations/2.9.7/jackson-annotations-2.9.7.jar \
  /home/node/webelexis/server/lib/jackson-annotations-2.9.7.jar
ADD https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-core/2.9.7/jackson-core-2.9.7.jar \
  /home/node/webelexis/server/lib/jackson-core-2.9.7.jar
ADD https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-databind/2.9.7/jackson-databind-2.9.7.jar \
  /home/node/webelexis/server/lib/jackson-databind-2.9.7.jar

#COPY server/lib/ /home/node/webelexis/server/lib/

USER root

RUN apk del build_deps

USER node

WORKDIR /home/node/webelexis/server
ENV NODE_ENV=dockered
CMD ["npm","run","dockered"]


