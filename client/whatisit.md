# Webelexis Client

## Konzept

Eine Aurelia-basierte Webapp zur Darstellung der Daten eines Arztpraxisprogramms. Primär gestaltet als Feathers-Client zur Kommunikation mit dem Feathers-basierten Elexis-Server. Der Transportlayer ist aber zentralisiert, so dass eine Umstellung etwa auf FHIR später möglich ist, sobald entsprechende Server zur Verfügung stehen.

Problem: Die Kommunikation derzeit ist bidirektional (real time update von Daten), was mit REST nicht ohne Weiteres möglich ist...
