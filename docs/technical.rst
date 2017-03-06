Technische Informationen
========================

Webelexis besteht aus zwei Komponenten: Einem client, der einen FHIR_-Kompatiblen Server erwartet, und einer Serverkomponente, *Janus*,
welche auf eine Elexis-Datenbank zugreift und deren Inhalte als FHIR Objekte bereitstellt, resp. FHIR-Objekte in einer für Elexis gebräuchlichen Form abspeichert.

Programmieren können Sie an sich mit jedem Texteditor; empfehlenswert ist einer, der Syntaxunterstützung für JavaScript und TypeScript bietet. Ein guter kostenloser Editor ist Atom_, Wenn Sie Geld ausgeben wollen, sei Ihnen Idea_ ans Herz gelegt. (Viele Programmierer schwören auf VisualStudio, aber das kenne ich selber nicht).

Auch bezüglich Betriebssystem sind Sie nicht festgelegt. Ich wechsle problemlos zwischen MacOS, Ubuntu Linux und Arch Linux, aber Windows sollte ebenfalls gehen, da es alle verwendeten Tools auch für Windows gibt.

Es folgt eine kurze Übersicht über die Webelexis Komponenten, damit Sie einen erstern Überblick zum Einstieg bekommen:

Janus
-----

Die Aufgabe besteht darin, Elexis-Datenbankstrukturen in FHIR-Objekte umzuwandeln. Das ist nicht immer ganz trivial, weil die FHIR- und Elexis- Philosophien
teilweise nicht kompatibel sind. FHIR hat den Anspruch, universell für jede Art von Gesundheitsinstitution geeignet zu sein, während Elexis klar ein Programm
für Arztpraxen ist. FHIR hat beispielsweise kein Konzept für Abrechung, während Elexis kein Konzept für Fhir *Schedules* und *Slots* hat, sondern Termine
allein in der Agenda-Tabelle verwaltet, welche wiederum vom FHIR *Appointment* unzureichend abgedeckt ist.

Eine Konsultation ist in Elexis eine Synthese aus Text,Befunden, Abrechnugnsdaten und Dokumenten wie Rezepten, Zeugnissen und Briefen, während ein *Encounter* in Fhir eigentlich nur eine
Zeitspanne ist, in der mehrere *Participants* zusammentreffen. Befunde und Dokumente können, müssen aber nicht in Relation zu *Encounters* stehen.

**Janus** übernimmt den Job, die beiden Welten miteinander zu verknüpfen. Zu diesem Zweck wird in /models zu jedem unterstützten FHIR Typ ein *Refiner* definiert, der die nötigen Datenbankzugriffe für die jeweilige FHIR Resource übernimmt. Am Ende steht ein JSON-Objekt, welches eine 1:1 Abbildung der FHIR-Resource ist, und welches in einer
Mongo-Datenbank gecached wird. Die mehr oder weniger aufwändige Konversion ist dann nur noch nötig, wenn ein angefordertes Objekt in der Elexis-Datenbank in einer neueren Version vorliegt. In /services finden sich die Klassen, die Datenbankzugriffe erledigen und zwischen den Datenbanken vermitteln. /routes enthält die üblichen Express_ -konformen Route-Definitionen für die REST Endpoints. Eintrittspunkt in die Anwendung ist /app.js. Um den Port [#]_ und andere "low level" Eigenschaften zu ändern, muss man bin/www editieren.

Client
------

Der Client ist eine Web-App, die in jedem Browser läuft, der die wesentlichsten ECMA 6 Sprachfeatures von JavaScript unterstützt. Das trifft auf die meisten aktuellen PC- und Mobil-Browser zu. Es ist eine Single Page Anwendung (SPA) auf Basis des relativ modernen SPA Frameworks Aurelia_. Die meisten Programmdateien sind in TypeScript und haben die Endung .ts. Webseiten sind oft in Jade geschrieben (welches neu pug heisst), und haben deswegen die Endung .html oder .pug.

Nach dem Start und login landet man in client/src/routes/dashboard/index, wo man einen Patientennamen eingeben kann. Nach Auswahl eines Patienten gelangt man zu client/src/routes/dashboard/detail. Eine View besteht in Aurelia immer aus einer gleichnamigen .ts und .html (bzw. .pug) Datei.

.. [#] Wenn Sie nur für den nächsten Start einen bestimmten Port vorgeben wollen, können Sie das zumindest unter Linux und MacOS auch einfach so tun: ``env PORT=2015 npm start`` (Wenn Sie für Port eine Nummer unter 1024 eingeben, müssen Sie allerdings "root" sein.)

.. _Express: http://expressjs.com
.. _FHIR: https://www.hl7.org/fhir/
.. _Aurelia: http://aurelia.io
.. _Atom: http:/www.atom.io
.. _Idea: http://www.jetbrains.com/idea
