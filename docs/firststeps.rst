Erste Schritte
==============

.. CAUTION:: Webelexis ist derzeit noch kein Enduser-Produkt.

.. index:: Einstieg

Systemvoraussetzungen
---------------------

Für die Erstellung der Server- und Client Komponenten benötigen Sie NodeJS_ Version 7.5.0 oder höher. Ich empfehle, NodeJS via nvm_ zu installieren:
``nvm install 7.5.0``. Nvm erleichtert das Hantieren mit verschiedenen Node-Versionen und installiert ausserdem alles im userspace, so dass man kein "sudo" benötigt.
(Wenn Sie auf einem Linux System Node global installieren, müssen Sie globale Anwendungen jeweils mit sudo laden: z.B. ``sudo npm install -g mocha``).

Der Server benötigt ausserdem Zugriff auf ein Java-8-jdk und auf einige Tools zum Konvertieren von Java-Datentypen. Diese sind in rgw-toolbox_ enthalten, s.unten.
Ausserdem wird ein Mongo_ Datenbankserver benötigt.

Die Webelexis
Applikation setzt einen einigermassen modernen Browser voraus (Chrome, Chromium oder Firefox empfohlen).
Um diese Dokumentation hier aus den Quellen zu erstellen, benötigen Sie Sphinx_.


Janus benötigt eine Elexis-Datenbank vom Typ Elexis_Ungrad_. Andere Elexis-Versionen ab 2.x können
gehen, es kann aber zu Problemen kommen.

Im Folgenden wird davon ausgegangen, dass sowohl der MySQL [#]_-Server mit der Elexis-Datenbabk, als auch der Mongo- Server
gestartet und erreichbar sind.

.. index:: Server

Installation Server
-------------------

Hier exemplarisch die Installation in einem frisch aufgesetzten Ubuntu 16.10. Zunächst Aufsetzen und Testen der Janus-Server Komponenten:

.. code-block:: bash

  curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.1/install.sh | bash
  nvm install 7.5.0
  sudo apt-get install git openjdk-8-jdk mongodb
  git clone https://github.com/rgwch/webelexis
  cd webelexis/Janus
  mkdir lib
  cd lib
  wget https://bintray.com/rgwch/maven/download_file?file_path=rgwch%2Frgw-toolbox%2F4.2.3%2Frgw-toolbox-4.2.3.jar -O rgw-toolbox-4.2.3.jar
  cd ..
  npm install
  npm install -g typescript
  npm install -g mocha
  tsc
  mocha


Wenn alle Tests fehlerfrei durchlaufen, kann die Verbindung zur Elexis Datenbank und dem Mongo-Server hergestellt werden:
Kopieren Sie Janus/config-sample.json nach Janus/config.json und passen Sie die Einträge an:

.. index:: config.json

.. code-block:: json

  {
  "mysqldb": {
    "user": "elexisuser",
    "password": "elexis",
    "host": "localhost",
    "database": "elexis"
    },
   "mongodb": {
    "url": "localhost/webelexis"
   }
  }


(Sie müssen nur den mysqldb-Teil zwingend anpassen; der mongodb-Teil sollte genau so bereits funktionieren, wenn Sie mongodb wie oben gezeigt mt apt-get installiert haben).

.. CAUTION:: Es wird strikt davon abgeraten, Webelexis an Ihrer produktiven Elexis-Datenbank zu testen. Verwenden Sie eine Kopie!


Starten Sie dann den Server in Janus: ``tsc && npm start``, und richten Sie Ihren Web Browser auf ``http://localhost:3000/fhir``. Wenn die Meldung "Webelexis FHIR Server" erscheint, dann funktioniert Ihr Setup so weit korrekt. Um die Verbindung mit dem Elexis-Server zu testen, geben Sie im Browser eine URL wie die folgende ein: ``http://localhost:3000/fhir/Patient?name=testperson`` (Verwenden Sie für testperson einen Namen oder Vornamen, von dem Sie wissen, dass er in Ihrer Elexis-Datenbank existiert).

Die Antwort des Servers wird eine JSON-Datei sein. Je nach Konfiguration des Browsers wird diese nicht angezeigt, sondern heruntergeladen.
Sie können sie dann mit einem Texteditor betrachten, und sollten etwas Ähnliches wie das Folgende sehen, nämlich ein FHIR-Bundle_

.. code-block:: json

  {
	"resourceType": "Bundle",
	"id": "f510d842-0e66-45ea-82c2-a9c59a88336d",
	"meta": {
		"lastUpdated": "2017-02-24T12:49:47+01:00"
	},
	"type": "searchset",
	"total": 1,
	"link": [{
		"relation": "self",
		"url": "/Patient?name=testperson"
	}],
	"entry": [{
		"fullUrl": "http://localhost/fhir/Patient/58a96dd781ae0212f7a994f5",
		"resource": {
			"_id": "58a96dd781ae0212f7a994f5",
			"resourceType": "Patient",
			"id": "7ba4632caba62c5b3a366",
			"identifier": [{
				"use": "usual",
				"system": "www.xid.ch/elexis-uuid",
				"value": "7ba4632caba62c5b3a366"
			}, {
				"use": "secondary",
				"system": "www.xid.ch/elexis-patientnr",
				"value": "312"
			}],
			"active": true,
			"name": [{
				"use": "usual",
				"text": "Testperson Armeswesen",
				"family": ["Testperson"],
				"given": ["Armeswesen"],
				"prefix": null,
				"suffix": null
			}],
			"telecom": [{
				"resourceType": "ContactPoint",
				"system": "phone",
				"value": "555-122 34 56",
				"use": "home",
				"rank": 1
			}, {
				"system": "phone",
				"value": "055 555 55 55 test",
				"use": "work",
				"rank": 3
			}, {
				"system": "email",
				"value": "testperson@invalid.mail",
				"use": "home",
				"rank": 4
			}],
			"address": [{
				"resourceType": "Address",
				"use": "home",
				"type": "both",
				"text": "Frau\nArmeswesen Testperson\nHintergasse 17\nCH - 9999 Elexikon\n",
				"line": ["Hintergasse 17"],
				"city": "Elexikon",
				"postalCode": "9999",
				"country": "CH"
			}],
			"meta": {
				"lastUpdated": "2017-02-19T09:54:30+01:00"
			}
		}
	}]
  }


.. index:: Client

Installation Client
-------------------

Wenn der Server soweit funktioniert, können Sie ihn mit CTRL-C wieder stoppen. Dann wird als nächstes der Aurelia-Client aufgebaut:

.. code-block:: shell

  cd ../client
  npm install
  npm install -g gulp
  npm install -g jspm
  jspm install -y
  gulp test

Wenn auch diese Tests erfolgreich durchlaufen (allfällige Warnungen während der npm und jspm-phasen können Sie ignorieren),
kann das Komplettsystem erstellt werden:

  ``gulp export``

Dies kompiliert alle Dateien, erstellt optimierte Javascript-Bundles und kopiert diese nach Janus/public/webapp. Danach können Sie den
Janus-Server wie oben gezeigt starten, und dann die Webelexis-App im Browser mit ``http://localhost:3000/webapp`` laden.
Als Username und Passwort können Sie in der aktuellen Version irgendetwas Beliebiges eingeben.


Dokumentation
-------------
Diese Dokumentation ist mit Sphinx_ erstellt. Der Quellcode befindet sich im Verzeichnis 'docs'. Zum Erstellen müssen Sie den entsprechenden Compiler installieren:

.. code-block:: shell

  cd ../docs
  sudo apt-get install python-pip
  pip install sphinx
  make html

Sphinx ermöglicht die verschiedensten Ausgabeformate. Mit ``make epub`` könnten Sie zum Beispiel auch ein E-Book aus dieser Dokumentation erstellen.

.. _Sphinx: http://www.sphinx-doc.org/en/stable/index.html
.. _NodeJS: https://nodejs.org/en/
.. _Elexis_Ungrad: http://www.elexis.ch/ungrad
.. _nvm: https://github.com/creationix/nvm
.. _rgw-toolbox: https://bintray.com/rgwch/maven/rgw-toolbox
.. _Mongo: https://www.mongodb.com/
.. _FHIR-Bundle: https://www.hl7.org/fhir/bundle.html

.. [#] Ein MariaDB-Server kann ohne Weiteres anstelle des MySQL-Servers verwendet werden. Für PostgreSQL müssen kleine Änderungen an Janus vorgenommen werden (NodeJS Treiber für Postgresql installieren etc.)
