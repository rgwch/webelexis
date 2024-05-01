# Installation des Webelexis-Servers

## 1. Vor der Installation


### Java JDK >=8 installieren

Da manche Elexis-Datentypen (ExtInfo, VersionedResource) sehr Java-spezifisch sind, ist eine Bearbeitung mit anderen Sprachen schwierig und fehlerbehaftet. Wir binden deswegen einen Java-Interpreter ein, der unter Nodejs läuft und nutzen ein Java-Tool, um diese Datentypen zu lesen und zu schreiben.

Daher muss auf dem Server Java (und zwar das JDK) 8.x installiert sein. Ob Oracle oder OpenJDK ist egal.

### Build tools installieren

Folgende packages müssen auf dem Server vorhanden sein (ist bei Standard-Ubuntu-Server bereits der Fall)

* build-essential
* python3 python3-pip

### Datenbank anpassen

In der Elexis-Datenbank herrscht ein buntes Durcheinander von Gross/Kleinschreibung, und die ID-Felder sind für Standard-UUIDs zu kurz. Ausserdem fehlen manche benötigten Felder.

*Achtung*: Bei der ersten Verbindung mit einer existierenden Elexis-Datenbank wird Webelexis die Datenbank folgendermassen verändern:

* Alle Tabellennamen sind klein geschrieben.
* Alle Feldnamen sind klein geschrieben.
* Alle Id-Felder heissen id und sind VARCHAR(40).
* Alle Tabellen haben ein 'deleted CHAR(1)' und ein 'lastupdate BIGINT' Feld.

Die Datenbank sollte dennoch kompatibel mit Elexis-Ungrad und Elexis 3.5 - 3.7 bleiben, aber dafür kann keine Garantie übernommen werden. Testen Sie Webelexis ausschliesslich an einer Kopie Ihrer produktiven Datenbank und machen Sie regelmässig Backups.

Das Script modifiziert natürlich nur diejenigen Tabellen, die beim ersten Start in der Datenbank vorhanden sind. Später von nachträglich installierten Plugins erstellte Tabellen müssen ggf. zusätzlich manuell angepasst werden (Oder man löscht den Eintrag "webelexis" in der Tabelle config, was für Webelexis das Signal ist, die Datenbank-Anpassung erneut durchlaufen zu lassen. Es schadet nicht, wenn sie mehrfach durchläuft.)


Nicht nur für Webelexis: vor dem Backup muss der User, der das Backup zieht, und der, der es wieder einspielt, Superuser-Rechte haben:

    create user backupadmin@'localhost' identified by 'supersecret';
    grant SUPER on *.* to backupadmin@'localhost';

Damit der Server im Entwicklungs/Testmodus laufen kann, muss in der Elexis-Datenbank ein Patient mit TitelSuffix 'unittest' existieren. Beispiel:

    use elexis;
    update kontakt set TitelSuffix="unittest" where Bezeichnung1 like "Test%" and istPatient="1" and deleted="0" limit 1;`

### Externe Dienste installieren

Webelexis arbeitet mit verschiedenen Diensten zusammen, speziell natrlich einem Elexis-Server, dazu aber auch Lucinda, Solr, Tika und CouchDB . Am Einfachsten können Sie alle Abhängigkeiten installieren und starten, wenn Sie Docker installieren, und in server/lib/external den Befehl `docker-compose up &` eingeben. Die benötigten Server werden dann automatisch heruntergeladen und gestartet. Wenn Sie sie das erste Mal starten, müssen Sie zunächst mit einem Browser auf http://localhost:5987/_utils gehen, sich dort mit dem on docker-compose genannten Passwort anmelden und einen single node oder cluster initialisieren.


### Nodejs installieren

Empfehlung: Node >=16 und NPM>=8 (Die verwendete Node-Version muss zwingend Features wie Promises und async/await, sowie fsPromises bieten). Ich empfehle, nur die stabilen Node-Versionen (also die mit gerader Nummer) einzusetzen.

### Webelexis clonen und installieren

    git clone https://github.com/rgwch/webelexis
    cd webelexis

Folgende Java-Libraries müssen besorgt und nach server/lib kopiert werden:

* jackson-annotations-2.13.2.jar
* jackson-core-2.13.2.jar
* jackson-databind-2.13.2.jar
* rgw-toolbox-4.2.11.jar

Man kann das automatisieren, wenn man Maven >=3.3 installiert hat: Einfach ins Verzeichnis server/lib gehen, und dort `./fetch.sh` eingeben.

Dann benötigte npm Libraries installieren:

    cd server
    npm install

(Das wird nur gelingen, wenn das Java-JDK wie oben beschrieben bereits installiert ist)
Nach einem Upgrade von NodeJS oder Java muss oft node-java neu installiert werden (leider sind die Fehlermeldungen von npm beim Startversuch nicht wirklich hilfreich)

    npm install java

In server/config/default.js die Verbindungsdaten zu einer für Webelexis angepassten Elexis-Datenbank (s. oben) eingeben.

In server/config/default.js bzw. production.js das authentication secret gegen etwas austauschen, was nicht hier im Internet steht.


Damit die Unit-Tests gelingen, irgendeinen Test-Patienten als "unittest" markieren (s.o.).

    npm test

sollte nun fehlerfrei durchlaufen

Dann Server mit `npm start` laufen lassen.


# Alternative: Docker

## 1. Docker installieren

Siehe die Prozedur für Ihr Betriebssystem bei [Docker](https://www.docker.com/get-started)

## 2. Konfiguration erstellen

Kopieren Sie server/config/default.js nach server/config/dockered.js und ändern Sie die Parameter, die in der Docker-Version anders sind.

## 3. Webelexis starten

`docker-compose up &`

## 4. Webelexis verwenden

Richten Sie Ihren Browser (vorzugsweise Chrome) auf `http://localhost:3000`

# Tipps

## Wie bekommt man eine existierende Elexis-Datenbank in den elexisdb-Container?

(Diese Kurzanleitung verwendet für Passwörter etc. die Vorgaben, die Sie hoffentlich geändert haben, also bitte anpassen)

* Docker-compose starten (entweder hier in server/lib/external oder in elexis-oob)
* Einen Elexis-Databenbank-Dump bereitstellen - hier z.B. elexis.sql
* `docker cp elexis.sql wlx_elexisdb://elexis.sql`
* `docker exec -it wlx_elexisdb /bin/bash`
* `mysql -u root -pelexisadmin`
* `create database elexiscopy;`
* `grant all on elexiscopy.* to elexisxuser@'%' identified by 'elexis';`
* `use elexiscopy;`
* `source /elexis.sql`
* `exit`
* `exit`
* 
  

  