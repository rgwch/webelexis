# Webelexis Benutzerhandbuch

## Einleitung

Dieses Handbuch führt Sie durch die Installation und Konfiguration eines Webelexis-Systems. Webelexis besteht aus einer 'Server'-Komponente, welche zwischen der Elexis-Datenbank und der Benutzerschnittstelle vermittelt, und einer 'Client'-Komponente, welche eben diese Benutzerschnittstelle aufbaut. Grundsätzlich sind beliebige Client-Programme möglich. Standardmässig wird der Server aber ein Programm bereitstellen, welches von einem modernen Web-Browser geladen und ausgeführt wird. Dabei ist es grundsätzlich gleichgültig, ob dieser Browser auf einem Smartphone, einem Tablet, einem Laptop oder einem Desktop-Computer ausgeführt wird, und es ist auch gleichgültig, wo auf der Welt dieses Endgerät sich befindet, solange es sich nur via Internet mit der Server-Komponente verbinden kann.

Dies hat selbstverständlich verschiedene Sicherheits-Implikationen, auf die ich später noch eingehen werde. Zunächst möchte ich Ihnen ans Herz legen, dass Sie:

* Den Webelexis-Server so installieren, dass er nicht via Internet, sondern nur über das lokale Netzwerk erreichbar ist.

* Die Einrichtung nur dann selber vornehmen, wenn Sie genug Sachkenntnis haben, um sicherzustellen, dass die Erreichbarkeit so beschränkt ist.

* Eine gute und korrekt konfigurierte Firewall zwischen Ihrem Praxisnetz und dem Internet einrichten bzw. einrichten lassen.

* Sicherheitsrichtlinien erstellen und durchsetzen, die möglichst weitgehend sicherstellen, dass keine Schadprogramme das Praxisnetz erreichen können. Dazu gehört zum Beispiel ein Verbot für die Mitarbeiter, Software auf den Praxiscomputern einzurichten und private E-Mails zu lesen. Dazu gehört Wahl eines Mailproviders für Praxis-Emails, der Schadsoftware möglichst schon vor dem Herunterladen erkennt und eliminiert. Dazu gehört auch und besonders, dass kein Praxismitarbeiter mit Administratorrechten arbeitet. Diese Auflistung ist nicht abschliessend.

Grundsätzlich  ist es empfehlenswert, die Serverkomponente von einer Person mit entsprechender Sachkenntnis einrichten zu lassen. Dieses Handbuch beginnt daher mit der Bedienung des Clients. Die Einrichtung des Servers wird im zweiten Teil beschrieben.


## Der Client

### Vorbedingungen

Sie benötigen ein internetfähiges Gerät mit einem modernen Browser. Empfehlenswert (und am besten getestet) sind [Google Chrome](https://www.google.com/chrome/) (Version 71 oder neuer) und dessen freier Bruder [Chromium](https://www.chromium.org/Home) (Version 72 oder neuer. Es spricht aber nichts dagegen, einen anderen Browser auszuprobieren, allerdings sollten Sie dann, wenn etwas nicht so funktioniert, wie es in diesem Handbuch beschrieben ist, zunächst testen, ob das Problem auch mit Chrome/Chromium auftritt, bevor Sie Fragen dazu stellen. Von der Nutzung des Internet Explorers und von Edge rate ich allerdings für Webelexis generell ab; es sind relativ viele Probleme dieser Browser mit JavaScript Anwendungen bekannt.

Damit kommen wir zur zweiten Vorbedingung: Sie müssen Javascript auf dem Browser zulassen, sonst kann das Programm nicht starten. Dies ist heutzutage bei den meisten Browsern ausser dem TOR-Browser ohnehin die Grundeinstellung.

Ausserdem benötigen Sie eine von diesem Client aus erreichbare laufende Elexis-Installation ab Version 3.4 oder Elexis-Ungrad 2018, und zwar mit einer MySQl- oder MariaDB Datenbank. PostgreSQL wird derzeit leider NICHT unterstützt. Wenn Sie das ändern wollen, können Sie das via Sponsoring oder Eigenentwicklung tun.

Das Betriebssystem ist egal. Webelexis läuft gleichermassen unter Linux, Windows und macOS.

## Start

Richten Sie den Browser auf http://IhrServer. (Ich werde in diesem Handbuch immer 'IhrServer' schreiben, wenn ich die Adresse Ihres Webelexis-Servers meine. Diese Adresse wurde Ihnen bei der Einrichtung des Servers mitgeteilt. Es kann entweder eine Nummer wie '192.168.0.1' oder ein symbolischer Name wie 'PraxisServer' sein, oder auch ein Internet-Name wie 'webelexis.ihrepraxis.ch'. Im letzteren Fall beginnt die Adresse dann vermutlich mit https:// statt http://, oder benötigt einen zuvor aufgebauten SSH- oder VPN-Tunnel, um zu funktionieren.

Sie werden dann von diesem Bildschirm begrüsst:



## Benutzerkonfiguration

Grundsätzlich erwartet Webelexis, dass alle Anwender als Kontakte in der Elexis-Datenbank erfasst sind. Einzige Bedingung: Der Kontakt muss eine E-Mail-Adresse erfasst haben. Als Webelexis-Anwender kommen nicht nur Elexis-Anwender in Frage, sondern alle in Elexis erfassten Kontakttypen, auch etwa Patienten. Dies ist darum so, damit man Patienten beispielsweise ermöglichen kann, selber Termine einzutragen oder eigene Laborwerte und Dokumente einzusehen. (Diese Funktionen sind bisher aber noch nicht vorhanden)

Als erster Benutzer muss immer der Administrator eingetragen werden. Dieser trägt den passenden Namen 'admin' und wird beim ersten Start des Servers automatisch erstellt. Er ist als einziger Anwender kein Elexis-Kontakt (zumindest nicht zwingend). Beim ersten Start des Servers kann er auf der Server-Konsole sein Passwort eingeben.

Wenn Sie sich als 'admin' einloggen, können Sie anschliessend von der Webelexis-Oberfläche aus weitere Anwender erstellen und verwalten.

## Briefvorlagen

In Webelexis sind Briefvorlagen in HTML erstellt. Das macht das System flexibler - man ist nicht mehr auf ein Textprogram wie OpenOffice oder Word angewiesen, dafür ist das Erstellen von Vorlagen aber ein wenig schwieriger. In `data/sample-docbase/templates` finden Sie einige Beispiele zum Anpassen. 
