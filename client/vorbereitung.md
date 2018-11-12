# Installation des Webelexis-Clients

Es wird empfohlen, zuerst den Webelexis-Server aufzusetzen (s. [dort](../server/vorbereitung.md))


* git installieren. falls nicht sowieso schon vorhanden

* NodeJS >=10 installieren (Die verwendete NodeJS-Version muss ES6-Features wie Promises und async/await unterstützen)

      # vom webelexis/server-Verzeichnis aus:
      cd ../client
      npm install
      npm install -g aurelia-cli 
      au run --watch --hmr

Die Parameter sind optional. --watch sorgt dafür, dass der webpack-compiler nach jeder Dateiänderung automatisch anspringt und --hmr (hot module replace) bewirkt, das die Webapp zum Ersetzen neu compilierten Codes nicht neu geladen, sondern nahtlos fortgesetzt wird (was oft, aber nicht immer gut geht).

Nach einem Upgrade von NodeJS oder dem Betriebssystem muss oft node-sass neu installiert werden (leider sind die Fehlermeldungen von npm beim Startversuch nicht wirklich hilfreich)

    npm install node-sass

