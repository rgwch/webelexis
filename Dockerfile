FROM node:alpine
EXPOSE 3030
EXPOSE 4040

WORKDIR /home/node
RUN apk add --no-cache openjdk8 \
  && apk add --no-cache --virtual build_deps python g++ gcc make binutils-gold bash git \
  && npm install -g aurelia-cli pm2 \
  && ln -s /usr/lib/jvm/java-1.8-openjdk/bin/javac /usr/bin/javac \
  && git clone https://github.com/rgwch/webelexis \
  && cd webelexis/client \
  && npm install \
  && au build --env prod \
  && cd ../selfservice \
  && npm install \
  && npm --production prune \
  && cd ../server \
  && npm install \
  && npm install java \
  && apk del build_deps \
  && npm --production prune \
  && npm remove -g aurelia-cli \
  && cd ../client \
  && npm --production prune \
  && chown -R 1000:1000 /home/node/webelexis

ADD --chown=1000:1000 https://bintray.com/rgwch/maven/download_file?file_path=rgwch%2Frgw-toolbox%2F4.2.7%2Frgw-toolbox-4.2.7.jar \
  /home/node/webelexis/server/lib/rgw-toolbox-4.2.7.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-annotations/2.9.8/jackson-annotations-2.9.8.jar \
  /home/node/webelexis/server/lib/jackson-annotations-2.9.8.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-core/2.9.8/jackson-core-2.9.8.jar \
  /home/node/webelexis/server/lib/jackson-core-2.9.8.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-databind/2.9.8/jackson-databind-2.9.8.jar \
  /home/node/webelexis/server/lib/jackson-databind-2.9.8.jar



USER node

WORKDIR /home/node/webelexis
ENV NODE_ENV=dockered
CMD ["pm2","start","--env", "dockered"]

