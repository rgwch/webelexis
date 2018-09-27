# Webelexis 3

Dies ist die dritte Iteration des Webelexis Projekts, komplettes rewrite und redesign. Eckpunkte:

* Microservice basiert (feathersjs). Dank bidirektionalem realtime API über socket.io werden clients über Veränderungen der angezeigten Objekte informiert. Polling des serverseitigen Status lokaler Objekte ist nicht mehr nötig.

* Data Layer im Prinzip auswechselbar. Wenn das FHIR API des Elexis-Servers mit den benötigten Datentypen funktioniert, ist ein Wechsel denkbar.

* Vorläufige Abkehr vom monolithischen "responsive" UI, stattessen optimiert für mittlere Bildschirmgrössen, andere UIs/Skins einfach einbaubar.
