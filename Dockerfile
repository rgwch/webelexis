FROM openjdk:8-jdk
LABEL maintainer "weirich@elexis.ch"
LABEL version="2.0.7"

ENV NODE_VERSION=7.5.0
ENV NVM_DIR=/usr/local/nvm
ENV LUCINDA=lucinda-server-1.1.5-SNAPSHOT.jar

RUN mkdir -p /usr/src/app/Janus && \
  mkdir -p /data/db && \
  apt-get update && apt-get install -y build-essential mongodb tesseract-ocr

RUN adduser --system webelexis

COPY Janus /home/webelexis/Janus/
WORKDIR /home/webelexis/Janus

RUN wget https://bintray.com/rgwch/maven/download_file?file_path=rgwch%2Frgw-toolbox%2F4.2.3%2Frgw-toolbox-4.2.3.jar -O lib/rgw-toolbox-4.2.3.jar && \
  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
RUN . $NVM_DIR/nvm.sh && \
  nvm install $NODE_VERSION && \
  nvm alias default $NODE_VERSION && \
  nvm use default

ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN npm install
RUN npm install java && npm rebuild node-sass && chmod +x dockerstart.sh

RUN wget http://www.elexis.ch/ungrad/products/lucinda/latest/$LUCINDA
ADD docker-lucinda.cfg lucinda.cfg

RUN apt-get remove -y build-essential && apt-get -y autoremove && apt-get -y clean

CMD ["./dockerstart.sh"]
