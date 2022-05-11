FROM node:10-alpine
EXPOSE 3030
EXPOSE 4040
ENV TIMEZONE=Europe/Zurich
ARG TOOLBOX_VER=2.0.10
ARG JACKSON_VER=2.13.2

WORKDIR /home/node
ADD client_v4/proprietary proprietary
RUN apk add --no-cache openjdk8 nano \
  && apk add --no-cache --virtual build_deps python g++ gcc make binutils-gold bash git tzdata\
  && npm install -g aurelia-cli pm2 \
  && ln -s /usr/lib/jvm/java-1.8-openjdk/bin/javac /usr/bin/javac \
  && git clone https://github.com/rgwch/webelexis \
  && cd webelexis/client_v4 \
  && cp -r /home/node/proprietary . \
  && rm -rf /home/node/proprietary \
  && npm install \
  && npm run build \
  && cd ../client_v3 \
  && npm install \
  && au build --env prod \
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
  && cd ../client_v3 \
  && npm --production prune \
  && cd ../client_v4 \
  && npm --production prune \
  && chown -R 1000:1000 /home/node/webelexis

ADD --chown=1000:1000 https://repo.repsy.io/mvn/rgwch/rgw-toolbox/rgwch/rgw-toolbox/${TOOLBOX_VER}/rgw-toolbox-${TOOLBOX_VER}.jar \
  /home/node/webelexis/server/lib/rgw-toolbox-${TOOLBOX_VER}.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-annotations/${JACKSON_VER}/jackson-annotations-${JACKSON_VER}.jar \
  /home/node/webelexis/server/lib/jackson-annotations-${JACKSON_VER}.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-core/${JACKSON_VER}/jackson-core-${JACKSON_VER}.jar \
  /home/node/webelexis/server/lib/jackson-core-${JACKSON_VER}.jar
ADD --chown=1000:1000 https://search.maven.org/remotecontent?filepath=com/fasterxml/jackson/core/jackson-databind/${JACKSON_VER}/jackson-databind-${JACKSON_VER}.jar \
  /home/node/webelexis/server/lib/jackson-databind-${JACKSON_VER}.jar



USER node

WORKDIR /home/node/webelexis
ENV NODE_ENV=dockered
CMD ["pm2","--no-daemon","start","--env", "dockered"]

