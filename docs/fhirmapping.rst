Abbildung von FHIR Ressourcen auf Webelexis/Elexis
==================================================

Basis-Datentypen
----------------

* Elexis Patient -> FHIR Patient
* Elexis Termin -> FHIR Appointment
* Elexis Konsultation -> FHIR Encounter
* Elexis Dokument -> FHIR DocumentReference
* Elexis Sticker -> FHIR Flag
* Elexis Reminders -> FHIR Flag
* Elexis Dokumente -> DocumentReference
* Elexis Labor und Befunde -> Observation

Kontakte
--------

In Elexis ist jeder Patient, Angehörige, Arzt, Spital etc, ein Kontakt.
FHIR sieht unterschiedliche Datentypen vor. So kann ein Elexis Kontakt auf folgende
FHIR-Typen gemappt werden:

* Patient_
* Practitioner_
* RelatedPerson_
* Organization_
* HealthcareService_
* Group_
* Person_


Problemliste/ICPC-2
-------------------

Webelexis verwendet, ebenso wie Elexis, das ICPC-2 Konzept der Organisation von Konsultationen
und Problemen ([#]_): Eine Episode ( <=> Problem) erstreckt sich über ein oder mehrere Encounters
(<=> Konsultationen), und hat jeweils einen Grund (Reason for encounter), eine Beurteilung/Diagnose
und ein Procedere.

FHIR_ :sup:`®© DSTU2` dagegen baut Bezüge zwischen Problemen und Konsultationen mit den Resourcen EpisodeOfCare_,
Encounter_ und Condition_ auf. Die EpisodeOfCare ist ein Zeitraum, in dem Patient, Arzt und
Gesundheitsorganisation in einer bestimmten Sache interagieren. Sie entspräche somit der ICPC-Episode,
oder dem Elexis-Problem. Allerdings enthält sie selbst keine Beschreibung oder Bezeichnung eines Problems,
sondern hält Referenzen auf null oder mehrere Conditions. Eine Condition wiederum entspricht weitgehend einem
'Problem'. Ein Encounter entspricht einer Konsultation.

Die Beziehung kann darum wie folgt beschrieben werden:

* Elexis Problem -> FHIR EpisodeOfCare (Organisations-Teil) und Condition (Medizinischer Teil)
* Elexis Konsultation -> FHIR Encounter


Fälle
-----

Ein Fall ist in Elexis eine rein buchalterische Abgrenzung: Die Verbindung des Patienten,
eines Kostenträgers und der Praxis. Dies hat nicht notwendigerweise etwas mit einer medinzinischen
Fall-Definition zu tun (welche eher als 'Problem') Eingang findet. Der Fall enthält alle Angaben, die zur
Leistungsverrechnung, Rechnungsstellung und Zahlungsabwicklung nötig sind.

FHIR hat zum Zeitpunkt dieses Schreibens keine vollständige Implementation eines Abrechnungsverfahrens
und auch keine Verknüpfung von medizinischen zu finanziell/organisatorischen Fällen.
Am ehesten würde "Coverage" dem Fall entsprechen. Eine Coverage wird von "Claims" referenziert, welche
wiederum am ehesten den Elexis "Leistungen" entsprechen. Allerdings ist fhir im Grunde für mitteleuropäische
Gesundheitssysteme wenig geeignet: Die Rechnung hat keinen direkten Zusammenhang mit Behandlungen, sondern
wird dem Patienten oder der Versicherung unabhängig gestellt. Wir müssen also frei definierbare Extension-Felder
nutzen, um Elexis Fälle in einem FHIR-Konzept zu persistieren (was wiederum für Interoperabilität
und Konformität notwendig ist).

Die Beziehung sieht also so aus:

* Elexis Konsultation -> FHIR Encounter
* Elexis Leistung -> FHIR Claim
* Elexis Fall -> FHIR Coverage

FHIR Claims enthalten Referenzen zu FHIR Coverages (im Feld "coverage").
Die Verbindung von Claims zu Encounters stellen wir mit einer Extension von Claim her:
:doc:`claim-encounter`.

.. code-block:: js

  {
    "resourceType": "Claim",
    "extension": [{
        "url":"http://www.xid.ch/fhir-match/claim-encounter",
        "valueReference":"Coverage/SUVA-Winterthur-1382777344"
      }]
    /* ... weitere elemente ... */
  }

Medikation
----------

Elexis Rezept -> FHIR MedicationOrder
Elexis Artikel -> FHIR Medication

FHIR MedicationApplocation -> Keine direkte Elexis-Entsprechung; Medikament verabreichen

Abrechnung
----------

Wie schon erwähnt ist das FHIR Rechnungskonzept im Grunde nicht kompatibel zu Elexis.
Im Moment läuft die Verwaltung von Rechnungen somit separat.




.. [#] http://www.rgw.ch/elexis/dox/elexis-icpc.pdf
.. _FHIR: https://www.hl7.org/fhir
.. _EpisodeOfCare: https://www.hl7.org/fhir/episodeofcare.html
.. _Encounter: https://www.hl7.org/fhir/encounter.html
.. _Condition: https://www.hl7.org/fhir/condition.html
.. _Patient: https://www.hl7.org/fhir/patient.html
.. _Practitioner: https://www.hl7.org/fhir/practitioner.html
.. _RelatedPerson: https://www.hl7.org/fhir/relatedperson.html
.. _Organization: https://www.hl7.org/fhir/organization.html
.. _Group: https://www.hl7.org/fhir/group.html
.. _HealthcareService: https://www.hl7.org/fhir/healthcareservice.html
.. _Person: https://www.hl7.org/fhir/person.html
