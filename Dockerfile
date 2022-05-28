FROM node:16-alpine
LABEL maintainer="weirich@webelexis.ch"
LABEL version="3.7.0"
EXPOSE 3030
EXPOSE 4040
ENV TIMEZONE=Europe/Zurich
ENV JAVA_HOME=/usr/lib/jvm/default-jvm
ARG TOOLBOX_VER=4.2.11
ARG JACKSON_VER=2.13.2

WORKDIR /home/node
RUN apk add --no-cache openjdk8 nano \
  && apk add --no-cache --virtual build_deps python2 python3 g++ gcc make binutils-gold bash git tzdata\
  && git clone https://github.com/rgwch/webelexis \
  && npm i -g npm@8.11.0 \
  && npm i -g pm2

RUN cd webelexis/server \
  && mv package-dockered.json package.json \
  && npm i -g node-gyp \
  && npm i iconv \
  && npm i java \
  && npm install \
  && npx tsc \
  && npm --production prune

RUN cd webelexis/client_v5 \
  && mv package-dockered.json package.json \
  && npm install \
  && npm run build \
  && npm --production prune \
  && cd ../selfservice \
  && npm install \
  && npm --production prune \
  && cp /usr/share/zoneinfo/${TIMEZONE} /etc/localtime \
  && apk del build_deps \
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

