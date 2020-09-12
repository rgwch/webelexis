# End To End (e2e) Tests

Diese Testen das Funktionieren des Gesamtprogramms (Im Gegensatz zu Unit-Tests).

Webelexis unterstützt zwei Konzepte

* Protractor-Scripts (*.e2e.ts). Vielseitig aber man muss die komplexe Selenium Sprache lernen. Vorbedingung: Protractor muss installiert sein. Ausführen mit `au protractor` (Webelexis  muss gestartet sein).

* Aufzeichnungen der Selenium IDE (*.side). Einfach durch Aufzeichnen von Benutzerinteraktionen zu erstellen, aber weniger flexibel. Vorbedingung: Ein Browser mit der [Selenium IDE](https://www.seleniumhq.org/selenium-ide/) installiert. Webelexis muss laufen, dann die entsprechende .side Datei in die IDE laden und starten.


