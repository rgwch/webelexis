Technische Informationen
========================

Webelexis besteht aus zwei Komponenten: Einem client, der einen FHIR-Kompatiblen Server erwartet, und einer Serverkomponente, *Janus*,
welche auf eine Elexis-Datenbank zugreift und deren Inhalte als FHIR Objekte bereitstellt, resp. FHIR-Objekte in einer für Elexis gebräuchlichen
Form abspeichert.

Janus
-----

Die Aufgabe besteht darin, Elexis-Datenbankstrukturen in FHIR-Objekte umzuwandeln. Das ist nicht immer ganz trivial, weil die FHIR- und Elexis- Philosophien
teilweise nicht kompatibel sind. FHIR hat den Anspruch, universell für jede Art von Gesundheitsinstitution geeignet zu sein, während Elexis klar ein Programm
für Arztpraxen ist. FHIR hat beispielsweise kein Konzept für Abrechung, während Elexis kein Konzept für Fhir *Schedules* und *Slots* hat, sondern Termine
allein in der Agenda-Tabelle verwaltet, wleche wiederum vom FHIR *Appointment* unzureichend abgedeckt ist. Eine Konsultation wiederum ist in Elexis 
eine Synthese aus Text,Befunden, Abrechnugnsdaten und Dokumenten wie Rezepoten, Zeugnissen udn Briefen, während ein *Encounter* in Fhir eigentlich nur eine
Zeitspanne ist, in der mehrere *Actors* zusammentreffen. Befunde und Dokumente können, müssen aber nicht in Relation zu *Encounters* stehen.

**Janus** übernimmt den Job, die beiden Welten miteinander zu verknüpfen. Zu diesem Zweck wird in /models zu jedem unterstützten FHIR Typ ein *Refiner* definiert,
der die nötigen Datenbankzugriffe für die jeweilige FHIR Resource übernimmt. Am Ende steht ein JSON-Objekt, welches eine 1:1 Abbildung der FHIR-Resource ist, und welch3es in einer
Mongo-Datenbank gecached wird. Die mehr oder weniger aufwändige Konversion ist dann nur noch nötig, wenn ein angefordertes Objekt in der Elexis-Datenbank in einer
neueren Version vorliegt. In /services finden sich die Klassen, die Datenbankzugriffe erledigen und zwischen den Datenbanken vermitteln. /routes enthält
die üblichen Express_ -konformen Route-Definitionen für die REST Endpoints.
   

