## Lucinda connector

This Service connects Webelexis with a [Lucinda](https://github.com/rgwch/lucinda) Server.

### Preparation

#### 1. install and run a Lucinda instance on a machine reachable by webelexis

* create a config.cfg

      # Language for the parser/tokenizer/indexer
      default_language=de

      # Use the REST interface
      rest_use=yes
      rest_port=2016

      # base directory for directories not named below
      fs_basedir=/srv/lucinda/store

      # where to keep the index. Make sure to backup this directory regularly
      fs_indexdir=/srv/lucinda/store/index

      # directory or comma separated list of directories to watch for changes and apply to index
      fs_watch=/srv/lucinda/store/inbox

      # Base directory for adding files programmatically (should be one of the directories named in 'watchdirs'
      # fs_import=/srv/lucinda/store/inbox

      # OCR to use for image files. At this time, only tesseract is supported. Must be installed separately
      ocr=tesseract

* run lucinda:

      java -jar lucinda-server-2.0.0-SNAPSHOT.jar

#### 2. tell Webelexis the connection details:

In `server/config/default.json` add:

       "lucinda":{
          "url": "http://localhost:2016/lucinda/2.0/"
        }

(Or whatever matches your setup)

#### 3. Run tests

* Launch a browser and navigate to `http://localhost:2016/lucinda/2.0/ping`. Lucinda should send back something like "Welcome to Lucinda".

* in `server/test/services/lucinda.test.js` change 'xdescribe'  to 'describe', and run `npm test`

