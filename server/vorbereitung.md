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

Nicht nur für Webelexis: vor dem Backup muss der User, der das Backup zieht, und der, der es wieder einspielt, Superuser-Rechte haben: 

    create user backupadmin@'localhost' identified by 'supersecret';
    grant SUPER on *.* to backupadmin@'localhost';

Damit der Server im Entwicklungs/Testmodus laufen kann, muss in der Elexis-Datenbank ein Patient namens 'unittest' existieren. Beispiel:

    use elexis;
    update kontakt set Bezeichnung1="unittest" where Bezeichnung1="Duck" and Bezeichnung2="Donald";`


### Solr installieren

Optional arbeitet Webelexis mit [Apache Solr](http://lucene.apache.org/solr/) als Dokumentenverwaltungssystem. Das hat viele Vorteile gegenüber Omnivore und ist eine für den Javascript-Bereich logische Weiterentwicklung der Lucene-basierten Elexis-Ungrad Dokumentenverwaltung [Lucinda](https://elexis.ch/ungrad/features/lucinda/).

Installation und Konfiguration von Solr ist vergleichsweise simpel. Siehe Website von Solr. Danach eine Coee namens "Webelexis" erstellen und dort alle Dokumente einlesen. Dies kann natürlich scriptgesteuert erfolgen.

### Html2pdf installieren

Wenn von Webelexis aus Dokumente (Rezpete, AUF, Briefe etc.) erstellt werden sollen, muss html2pdf auf dem Server installiert werden.

### Nodejs installieren

Emfehlung: Node >10 und NPM>5

### Webelexis clonen und installieren

    git clone https://github.com/rgwch/webelexis
    cd webelexis

Folgende Libraries müssen besorgt und nach server/lib kopiert werden:

* jackson-annotations-2.7.0.jar
* jackson-core-2.7.4.jar
* jackson-databind-2.7.4.jar
* rgw-toolbox-4.2.6.jar

Man kann das automatisieren, wenn man Maven >=3.3 installiert hat: Einfach ins Verzeichnis server/lib gehen, und dort `./fetch.sh` eingeben.

Dann benötigte npm Libraries installieren:

    cd server
    npm install

(Das wird nur gelingen, wenn das Java-JDK wie oben beschrieben bereits installiert ist)
Nach einem Upgrade von NodeJS oder Java muss oft node-java neu installiert werden (leider sind die Fehlermeldungen von npm beim Startversuch nicht wirklich hilfreich)

    npm install java

In server/config/default.json die Verbindungsdaten zu einer für Webelexis angepassten Elexis-Datenbank (s. oben) eingeben

Damit die Unit-Tests gelingen, irgendeinen Test-Patienten in "unittest" umbenennen (s.o.)Vorname und sonstige Personalien sind egal.

    npm test

sollte nun fehlerfrei durchlaufen

Dann Server mit `npm start` laufen lassen.

### Client aufsetzen und testen

    cd ../client
    npm install
    npm install -g aurelia-cli
    au run

Dann einen Browser auf localhost:9000 richten.    

