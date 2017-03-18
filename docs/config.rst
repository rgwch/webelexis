Konfiguration
=============

Die Konfiguration von Webelexis geschieht grundsätzlich vom Server aus. Bei der Verbindungsaufnahme versucht der Client, die Konfiguration zu erhalten. Wenn dies fehlschlägt, etwa weil der Server kein Webelexis-Janus-Server, sondern ein andere FHIR-Server ist, dann fällt der client auf eine Standardkonfiguration zurück.

Die Konfigurationsdatei ist Janus/config.json. Wie die Dateiendung schon sagt, handelt es sich um eine Datei im JSON_-Format.

Das JSON-Format erlaubt leider keine Kommentare in der Datei. Darum werden hier alle Einträge beschrieben:

Oberste Ebene:
--------------
* loglevel - Einstellung des Log Levels
* mysqldb - Konfiguration der Mysql-Datenbankverbindung für Janus
* mongodb - Konfiguration der Mongo-Datenbankverbindung für Janus
* client - Konfiguration, die an den Client geschickt wird.

loglevel:
^^^^^^^^^
Kann einer der folgenden Werte sein: "debug","info","warning","error","none"

mysqldb:
^^^^^^^^
* host: Netzwerkadresse oder Netzwerkname der Maschine, auf der die MySQL-Datenbank läuft
* database: Name der zu verwendenden Datenbank
* user: Benutzername für die Datenbank
* passwort: Passwort für die Datenbank

mongodb:
^^^^^^^^
* url: Verbindungs-URL für die Datenbank
* user: Benutzername (falls einer gesetzt ist)
* password: Passwort (falls eines gesetzt ist)

client:
^^^^^^^

* general:

  - officeName: anzuzeigender Name der Praxis bzw, der Institution
  - actors: Definition aller Beteiligten.

    + shortLabel: Eine kurzze Identifikation
    + label:  Anzuzeigende Identifikation
    + fullname: Voller Name
    + id: ID in der FHIR-Datenbank

    (nur shortLabel muss zwingend angegeben werden)

* agenda: Definition der Agenda-Parameter

  - types: Liste der möglichen Termintypen. Die Typen "free" und "unassignable" müssen immer vorhanden sein, und müssen auch diesen 'name' haben.

    + name: Name des Typs
    + label: Anzeige für den Anwender
    + fg: Vordergrundfarbe (in `HTML Notation`_)
    + bg: Hintergrundfarbe
    + duration: Vorgabe-Dauer des Termins

  - states: Mögliche Termin-Statusarten. Diese sind von FHIR vorgegeben. Man kann allerdings zusätzlich weitere Statusarten angeben, die dann nicht mehr kompatibel zu anderen FHIR-Anwendungen sind.

    + name: Name des Status, FHIR gibt die Namen "proposed" (noch nicht bestätigt), "pending" (noch nicht definitiv), "booked" (definitiv eingetragen), "arrived" (eingetroffen), "fulfilled" (fertig), "cancelled" (abgesagt) und "noshow" (verpasst) vor.
    + label: Anzeige für den Anwender
    + fg: Vordergrundfarbe in `HTML Notation`_
    + bg; Hintergrundfarbe

  - scheduleType: Welcher ScheduleType an FHIR-Clients gemeldet wird.
  - slots: Definition der buchbaren Zeiträume.

    + default: Dieser Slot wird immer verwendet, wenn kein besser passender vorhanden ist.
    + weitere Slots können mit ISO-Bezeichnungen eingetragen werden. Beispiel: "sun" (gilt immer sonntags), "2017-07-12 2017-07-28" (gilt für den angegebenen Zeitraum) etc. Ein Slot, in dem gar keine Termine vergeben werden können,wird als leeres Array [] angegeben. Ein Slot, in dem Termine vergeben werden, wird mit einem oder mehreren "timespan"-Einträgen deklariert.


.. _JSON: https://de.wikipedia.org/wiki/JavaScript_Object_Notation
.. _HTML Notation: http://www.colorpicker.com/