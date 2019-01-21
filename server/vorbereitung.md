# Installation des Webelexis-Servers

## 1. Vor der Installation

### Java JDK >=8 installieren

Da manche Elexis-Datentypen (ExtInfo, VersionedResource) sehr Java-spezifisch sind, ist eine Bearbeitung mit anderen Sprachen schwierig und fehlerbehaftet. Wir binden deswegen einen Java-Interpreter ein, der unter Nodejs läuft und nutzen ein Java-Tool, um diese Datentypen zu lesen und zu schreiben.

Daher muss auf dem Server Java (und zwar das JDK) >=8.0 installiert sein. Ob Oracle oder OpenJDK ist egal.

### Datenbank anpassen

In der Elexis-Datenbank herrscht ein buntes Durcheinander von Gross/Kleinschreibung, und die ID-Felder sind für Standard-UUIDs zu kurz. Ausserdem fehlen manche benötigten Felder.

Das SQL-Script modify_elexis.sql (anwenden z.B. mit `use elexis; source modify_elexis.sql`) erledigt die für Webelexis nötigen Anpassungen. Die Datenbank bleibt dennoch kompatibel mit Elexis-Ungrad und Elexis 3.6. Achtung: Das Script modifiziert nur diejenigen Tabellen, die auf meiner Datenbank vorhanden sind. Das sind so ziemlich alle, die vom Kern und von OpenSource Plugins erstellt wurden. Andere Tabellen müssen ggf. zusätzlich manuell angepasst werden:

* Id-Felder heissen immer id (klein geschrieben) und sind VARCHAR(40).
* Dementsprechend müssen auch foreign key Felder auf VARCHAR(40) erweitert werden, der Feldname kann aber unverändert bleiben.
* Alle Tabellen haben `deleted char(1)` und `lastupdate bigint` Felder.

*Achtung*: Wenn Sie diese Datenbankanpassung unterlassen, werden sporadisch 'seltsame' Fehler auftreten.
Zum Beispiel werden möglicherweise Objekte verwechselt (weil die id in 24 statt 40 Felder gespeichert wird und somit eventuell nicht mehr eindeutig ist)

Nicht nur für Webelexis: vor dem Backup muss der User, der das Backup zieht, und der, der es wieder einspielt, Superuser-Rechte haben:

    create user backupadmin@'localhost' identified by 'supersecret';
    grant SUPER on *.* to backupadmin@'localhost';

Damit der Server im Entwicklungs/Testmodus laufen kann, muss in der Elexis-Datenbank ein Patient mit TitelSuffix 'unittest' existieren. Beispiel:

    use elexis;
    update kontakt set TitelSuffix="unittest" where Bezeichnung1 like "Test%" and istPatient="1" and deleted="0" limit 1;`


### Lucinda installieren

Optional arbeitet Webelexis mit [Lucinda](https://elexis.ch/ungrad/features/lucinda/) als Dokumentenverwaltungssystem. Das hat viele Vorteile gegenüber Omnivore.

Installation und Konfiguration von Lucinda ist vergleichsweise simpel.


### Nodejs installieren

Empfehlung: Node >10 und NPM>5 (Die verwendete Node-Version muss zwingend Features wie Promises und async/await, sowie fsPromises bieten).

### Webelexis clonen und installieren

    git clone https://github.com/rgwch/webelexis
    cd webelexis

Folgende Libraries müssen besorgt und nach server/lib kopiert werden:

* jackson-annotations-2.9.8.jar
* jackson-core-2.9.8.jar
* jackson-databind-2.9.8.jar
* rgw-toolbox-4.2.7.jar

Man kann das automatisieren, wenn man Maven >=3.3 installiert hat: Einfach ins Verzeichnis server/lib gehen, und dort `./fetch.sh` eingeben.

Dann benötigte npm Libraries installieren:

    cd server
    npm install

(Das wird nur gelingen, wenn das Java-JDK wie oben beschrieben bereits installiert ist)
Nach einem Upgrade von NodeJS oder Java muss oft node-java neu installiert werden (leider sind die Fehlermeldungen von npm beim Startversuch nicht wirklich hilfreich)

    npm install java

In data/settings.js die Verbindungsdaten zu einer für Webelexis angepassten Elexis-Datenbank (s. oben) eingeben.

In server/config/default.json bzw. production.json das authentication secret gegen etwas austauschen, was nicht hier im Internet steht.


Damit die Unit-Tests gelingen, irgendeinen Test-Patienten als "unittest" markieren (s.o.).

    npm test

sollte nun fehlerfrei durchlaufen

Dann Server mit `npm start` laufen lassen.

### Client aufsetzen und testen

    cd ../client
    npm install
    npm install -g aurelia-cli
    au run

Dann einen Browser auf localhost:9000 richten.

# Alternative: Docker

## 1. Docker installieren

Siehe die Prozedur für Ihr Betriebssystem bei [Docker](https://www.docker.com/get-started)

## 2. Konfiguration vorbereiten

Ein Verzeichnis 'data' im aktuellen Verzeichnis erstellen. Dort eine Datei 'settings.js' erstellen:


```
module.exports={
  testing: true,
  sitename: "Praxis Webelexis",
  admin: "someone@webelexis.ch",
  adminpwd: "oh so secret",
  docbase:" "../data/sample-docbase"",
   mandators: {
    default: {
      name: "Dr. med. Dok Tor",
      street: "Hinterdorf 17",
      place: "9999 Webelexikon",
      phone: "555 55 55",
      email: "chefe@webelexis.org",
      zsr: "G088113",
      gln: "123456789012"
    }
  },
  elexisdb: {
    host: "172.121.16.3",
    database: "elexis",
    user: "elexisuser",
    password: "topsecret",
    automodify: true
  }
}
```

(Wobei Sie natürlich die Angaben anpassen müssen)

## 3. Webelexis starten

`sudo docker run -p 80:3030 --name webelexis -v `pwd`/data:/home/node/webelexis/data rgwch/webelexis:latest`

## 4. Webelexis verwenden

Richten Sie Ihren Browser (vorzugsweise Chrome) auf `http://localhost`
