FROM node:10-alpine
EXPOSE 3030
EXPOSE 4040
ENV TIMEZONE=Europe/Zurich

WORKDIR /home/node
RUN apk add --no-cache openjdk8 nano \
  && apk add --no-cache --virtual build_deps python g++ gcc make binutils-gold bash git tzdata\
  && npm install -g aurelia-cli pm2 \
  && ln -s /usr/lib/jvm/java-1.8-openjdk/bin/javac /usr/bin/javac \
  && git clone https://github.com/rgwch/webelexis \
  && cd webelexis/client_v3 \
  && npm install \
  && au build --env prod \
  && cd ../client_v4 \
  && npm install \
  && npm run build \
  && cd ../selfservice \
  && npm install \
  && npm --production prune \
  && cd ../server \
  && npm install \
  && npm install java \
  && cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
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
CMD ["pm2","--no-daemon","start","--env", "dockered"]

