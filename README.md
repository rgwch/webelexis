# Webelexis

Die schlanke, flinke Ergänzug zu Elexis

* Läuft im Browser
* läuft auf Mobilgeräten
* lässt sich auch über Mobilnetze flüssig bedienen
* kann (bei weitem) nicht alles, was Elexis kann, sondern erledigt Kernaufgaben unkompliziert.
* Kann parallel mit Elexis im selben Netz eingesetzt werden.

## Demo Videos

[Einstieg](https://youtu.be/eN2FyPkbNJM), 
[Patientenliste](http://www.screencast.com/t/dZygwPdHG09e), 
[Medikation](http://www.screencast.com/t/gvsjA5Cubwgm), 
[Agenda](https://youtu.be/k0_RfUutVSc), 
[Konsultation](http://www.screencast.com/t/5EnOY5EUd)

## Installationsanleitungen

Siehe [hier](server/vorbereitung) für den Server und [hier](client/vorbereitung) für den Client.

## Kurzanleitung für die Docker-Version

**ACHTUNG**: Nur an einer Kopie der produktiven Datenbank testen.

**ACHTUNG**: Nur hinter einer Firewall oder an einer Test-Datenbank ohne echte Patientendaten testen.

### - Einen Ordner 'data' erstellen, und darin eine Datei 'settings.js' mit folgenden Einträgen:

```
module.exports={
  testing: true,
  sitename: "Praxis Webelexis",
  admin: "someone@webelexis.ch",
  elexisdb: {
    host: "172.121.16.3",
    database: "elexis",
    user: "elexisuser",
    password: "topsecret"
  }
}
```

### - Dann im Terminal:

    mysql -h host -u username -ppasswort elexis <modify_elexis.sql  # Natürlich nur beim ersten Mal
    sudo docker run -p 80:3030 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:latest

### - Dann einen Browser auf `http://localhost` richten.

(bzw. wo auch immer der Docker-Container erreichbar ist)

## Run from scratch

Webelexis kann auch auf einer leeren Datenbank gestartet werden (mysql oder sqlite). Es erstellt dann selber die Webelexis-Datenstrukturen. Diese Datenbank ist dann aber nicht garantiert kompatibel zu Elexis, sollte also nur für reine Webelexis-Umgebungen verwendet werden. Wann immer gemischter Betrieb vorgesehen ist (das ist das empfohlene Setup), sollte zuerst Elexis und dann Webelexis initialisiert werden.

## Technische Grundlage Webelexis 3

Dies ist die dritte Iteration des Webelexis Projekts, komplettes rewrite und redesign. Eckpunkte:

* Microservice basiert (feathersjs). Dank bidirektionalem realtime API über socket.io werden clients über Veränderungen der angezeigten Objekte informiert. Polling des serverseitigen Status lokaler Objekte ist nicht mehr nötig.

* Data Layer im Prinzip auswechselbar. Wenn das FHIR API des Elexis-Servers mit den benötigten Datentypen funktioniert, ist ein Wechsel denkbar.

* Vorläufige Abkehr vom monolithischen "responsive" UI, stattessen optimiert für mittlere Bildschirmgrössen, andere UIs/Skins einfach einbaubar.
