Deployment
==========

Dockerfile
----------

.. index:: Docker

Das Projekt enthält ein Dockerfile, mit dem man recht einfach einen Docker-Container mit einem kompletten
Webelexis-System erstellen kann. Sie müssen dazu zunächst Docker_ für Ihr Betriebssystem installieren. Dann genügt ein
einziger Befehl:

``docker build -t rgwch/webelexis:1.0``

erstellt alles nötige. Danach kann man den Container mit

``docker run -d -p 2016:3000 -v /pfad/zum/config.json:/usr/src/app/Janus/config.json rgwch/webelexis:1.0``

starten, und den Browser auf ``http://localhost:2016/fhir`` richten, um den Server zu sehen, resp auf
``http://localhost:2016/webapp`` um die Webelexis-Webapp zu starten.

Standalone-App
--------------

.. index:: Electron, Standalone

Wenn Sie die Anwendung nicht im Browser, sondern als eigenständiges Programm starten wollen, können Sie dazu Electron_ verwenden. Eine
Electron Anwendung läuft gleichermassen auf Windows, Linux und MacOS. Für einen kurzen Einblick genügt:

.. code-block:: bash

  cd client
  sudo npm install -g electron-prebuilt
  sudo npm install
  electron index.js

Dann sehen Sie, wie die Standalone-Anwendung aussehen und funktionieren würde. (Zum Test muss natürlich auch der Server mit ``npm start`` gestartet sein)

Um die Anwendung fixfertig vertriebsgerecht zu erstellen, müssen Sie den electron-packager verwenden. Eine Anleitung dazu würde hier zu weit führen.


Sicherheitsüberlegungen
-----------------------

.. index:: Sicherheit, absichern, Firewall

Grundsatz
^^^^^^^^^

Selbstverständlich dürfen Sie eine Arztpraxis-Anwendung nicht 'einfach so' ans Internet hängen. Es gelten die Bestimmungen zum Datenschutz und
zum Arztgeheimnis. Das hier gezeigte Setup ist ausschliesslich für die Verwendung innerhalb des gegen aussen abgesicherten Praxisnetzwerks
zugelassen. Insbesondere müssen Sie sicherstellen, dass alle von dieser Anwendung und den Datenbankservern geöffneten Ports (2016,3000,27017,28017, 3306) von einer Firewall
geblockt werden [#]_ .

Eigenbedarf
^^^^^^^^^^^

Es ist legitim, wenn Sie auch von Hausbesuchen oder von zuhause aus auf Ihre Praxisdaten zugreifen wollen. In diesem Fall muss man einen
definierten, gesicherten Zugang erstellen. Dies geht für diesen Zweck (Zugang nur für einen exakt definierbaren Personenkreis) am Besten
mit einem VPN_, also eine verschlüsselte "Tunnel" Verbindung von Ihrem Endgerät zum Praxisnetzwerk. Ein solcher Tunnel darf, solange die Schlüssel nicht
kompromittiert sind, als gleich sicher gelten, wie ein reines in-house Netzwerk.

Erweiterter Zugang
^^^^^^^^^^^^^^^^^^

Wenn Sie einem erweiterten Personenkreis Zugang gewähren wollen [#]_, oder keine Möglichkeit haben, ein VPN zu erstellen, müssen Sie etwas
mehr Aufwand betreiben:

* Die Anwendung darf ausschliesslich über verschlüsselte (https://...) Verbindungen erreichbar sein.
* Es muss eine sichere Passwortabfrage und -Verwaltung eingerichtet werden.
* Die IP muss bei Nameservern bekannt gemacht werden, damit man die Anwendung über "https://termine.praxisname.ch" oder so erreichen kann. [#]_
* Sie benötigen ein anerkanntes Zertifikat_, damit Ihre Besucher nicht eine Sicherheitswarnung des Browsers bekommen.



.. [#] Es ist ohnehin am besten, die Firewall sämtliche Ports blockieren zu lassen, und bei Bedarf nur die freizugeben, die man wirklich benötigt.
.. [#] Zum Beispiel, um Patienten zu ermöglichen, selber einen Termin zu vereinbaren.
.. [#] Machen Sie aber nicht den Fehler, im Umkehrschluss zu denken, dass die Anwendung nicht gefunden werden kann, und dass darum keine Absicherungsmassnahmen nötig seien, wenn Sie keine Nameserver-Publikation machen! Ihr Server ist immer über seine IP erreichbar, die von Schadprogrammen herausgefunden werden kann.

.. _VPN: https://de.wikipedia.org/wiki/Virtual_Private_Network
.. _Zertifikat: https://de.wikipedia.org/wiki/Digitales_Zertifikat
.. _Electron: https://electron.atom.io/
.. _Docker: https://www.docker.com