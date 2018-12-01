FROM node:alpine
RUN apk add openjdk bash

RUN apk add --no-cache --virtual build_deps \
  && python \
  && g++ \
  && gcc \
  && make \
  && binutils-gold

RUN cd /home/node && git clone https://github.com/rgwch/webelexis \
  && npm install -g aurelia-cli

COPY server/lib/* webelexis/server/lib/

USER node
RUN cd webelexis/client \
  && npm install \
  && au build --env prod \
  && cd ../server \
  && npm install \
  && npm install java






