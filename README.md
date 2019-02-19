# Webelexis

Die schlanke, flinke Ergänzung zu Elexis

* Läuft im Browser
* läuft auf Mobilgeräten
* lässt sich auch über Mobilnetze flüssig bedienen
* kann (bei weitem) nicht alles, was Elexis kann, sondern erledigt Kernaufgaben unkompliziert.
* Kann parallel mit Elexis im selben Netz eingesetzt werden.

## Demo Videos

[Einstieg](https://youtu.be/eN2FyPkbNJM), 
[Patientenliste](http://www.screencast.com/t/dZygwPdHG09e), 
[Medikation](https://youtu.be/ylgkfbbEv5E),
[Agenda](https://youtu.be/k0_RfUutVSc), 
[Konsultation, Makros](https://www.youtube.com/watch?v=uuUfb1l7gt0)

## Installationsanleitungen

Wenn Sie Webelexis einfach mal ausprobieren möchten, machen Sie das am einfachsten via Elexis-OOB.

Ansonsten:

Siehe [hier](server/vorbereitung.md) für den Server und [hier](client/vorbereitung.md) für den Client. Falls Sie Webelexis
mit einem FHIR-Server verbinden wollen, z.B. [Elexis-Server](https://github.com/elexis/elexis-server), lesen Sie im [FHIR-Unterverzeichnis](client/src/fhir/whatisit.md) nach (dieses feature ist allerdings im prä-alpha-Stadium). 

## Kurzanleitung für die Docker-Version

**ACHTUNG**: Nur an einer Kopie der produktiven Datenbank testen.

**ACHTUNG**: Nur hinter einer Firewall oder an einer Test-Datenbank ohne echte Patientendaten testen.

### - Einen Ordner 'data' erstellen, und darin eine Datei 'settings.js' erstellen.

Beginnen Sie mit einer Kopie von [settings-example.js](data/settings-example.js) und ändern Sie die Einträge passend für Ihr System.


### - Dann im Terminal:

    mysql -h host -u username -ppasswort elexis <modify_elexis.sql  # Natürlich nur beim ersten Mal
    sudo docker run -p 80:3030 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:latest

Achtung: Webelexis wird beim ersten Start (wenn in settings.js automodify auf true gesetzt ist), einige Datenbankanpassungen vornehmen, die in [server/vorbereitung.md](server/vorbereitung.md) näher beschrieben sind. Wenn automodify auf 'false' gesetzt ist, wird Webelexis keine Änderungen vornehmen, aber den Start verweigern, falls die Datenbank noch nicht angepasst ist.   

Wenn Sie nicht unbedingt eine spezifische Version möchten, würde ich empfehlen,immer webelexis:latest zu wählen. Wenn sie die allerneueste aber eventuell "kaputte" Version ausprobieren möchten, wählen Sie webelexis:bleeding.

### - Dann einen Browser auf `http://localhost` richten.

(bzw. wo auch immer der Docker-Container erreichbar ist)

## Run from scratch

Webelexis kann auch auf einer leeren Datenbank gestartet werden (mysql oder sqlite). Es erstellt dann selber die Webelexis-Datenstrukturen. Diese Datenbank ist dann aber nicht garantiert kompatibel zu Elexis, sollte also nur für reine Webelexis-Umgebungen verwendet werden. Wann immer gemischter Betrieb vorgesehen ist (das ist das empfohlene Setup), sollte zuerst Elexis und dann Webelexis initialisiert werden.


## Technische Grundlage Webelexis 3

Dies ist die dritte Iteration des Webelexis Projekts, komplettes rewrite und redesign. Eckpunkte:

* Microservice basiert (feathersjs). Dank bidirektionalem realtime API über socket.io werden clients über Veränderungen der angezeigten Objekte informiert. Polling des serverseitigen Status lokaler Objekte ist nicht mehr nötig.

* Data Layer im Prinzip auswechselbar. Wenn das FHIR API des Elexis-Servers mit den benötigten Datentypen funktioniert, ist ein Wechsel denkbar.

* Vorläufige Abkehr vom monolithischen "responsive" UI, stattessen optimiert für mittlere Bildschirmgrössen, andere UIs/Skins einfach einbaubar.
