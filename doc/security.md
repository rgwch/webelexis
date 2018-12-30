# Empfehlungen zu Sicherheit

## Sicherheit gegen Datenverlust

Eine Selbstverständlichkeit: Fertigen Sie mindestens tägliche Backups an, und lagern Sie einige dieser Backups ausserhalb der Praxis. Achten Sie darauf, dass nur das Administratorkonto des Servers Zugriff auf die Backup-Laufwerke hat, und nutzen Sie dieses Administratorkonto möglichst selten oder nie.

*Hintergrund*: Falls es einem Verschlüsselungstrojaner gelingt, auf irgendeinen Ihrer Praxiscomputer zu kommen, wird er jede Datei verschlüsseln, die er erreichen kann. Dabei wird er die Zugriffsrechte des Anwenders haben, der ihn ins System gebracht hat. Wenn Sie Ihre Backups nun als gewöhnlicher Anwender erstellen, werden diese danach auch vom Trojaner verschlüsselt sein, Ihnen also nichts mehr nützen.

## Sicherheit gegen Vertraulichkeitsbruch

Ein weites Feld. Ihre Patientendaten sind höchst vertraulich. Es muss absolut sicher sein, dass kein Unbefugter darauf Zugriff erhält. Unbefugt ist grundsätzlich jeder ausser Ihnen selbst und Ihrem medizinischen Praxispersonal. Grundsätzlich gibt es drei mögliche Schwachstellen: Erstens der Ort, auf dem die Daten gespeichert sind, also die Festplatte des Servers. Zweitens die Zugriffsberechtigung: Wer darf sich von wo aus einloggen? Und wie gut sind diese Logins gesichert? Und drittens der Transport der Daten durchs Netzwerk: Könne das Netzwerk irgendwo abgehört werden, so dass auch jemand Daten mitlesen kann, der gar nicht eingeloggt ist? Ich werde diese drei Bereiche im Folgenden kurz diskutieren:

### Der Speicherort

Ihr Server mag mit einem starken Passwort gesichert sein, aber jeder, der physischen Zugang hat oder erlangen kann, kann diese Sperre mühelos umgehen: Man kann zum Beispiel einfach mit einem eigenen Betriebssystem, auf dem man selbst Administrator ist, von einem USB-Stick oder einer CD booten. Oder man baut die Festplatte aus und schliesst sie an einem eigenen Computer an. Und Ihr Computer wird nicht ewig funktionieren. Irgendwann werden Sie ihn entsorgen, und dann sind die Daten vermutlich immer noch da, wenn Sie sich nicht die Mühe machen, alle Festplatten physisch zu zerstören. Auch Überschreiben hilft nicht: Immer mehr Computer haben SSDs anstelle rotierender Magnetscheiben, und SSDs verhalten sich beim Schreiben unvorhersehbar. Mit grösster Wahrscheinlichkeit wird ein Überschreibvorgang die Daten nicht überschreiben, sondern irgendwo anders schreiben. Man kann aber nicht sagen, wo. 

Gegen all diese möglichen Schwachstellen gibt es eine vergleichsweise einfache Lösung: Die Partition, auf der die Daten gespeichert sind, muss verschlüsselt werden. Dann muss man sich zwar bei jedem Neustart die Mühe machen, die Passphrase einzugeben, aber dafür werden die Daten nach einem simplen Herunterfahren oder Ausschalten des Servers garantiert unlesbar für jeden, der die Passphrase nicht kennt.

### Die Zugriffsberechtigung

#### Praxisnetz

Innerhalb der Praxis ist das relativ einfach zu lösen: Man erteilt genau jeder berechtigten Person eine Zugriffsberechtigung. Da man sieht, wer an den Praxiscomputern sitzt, hat man jederzeit den Überblick, ob das nur Berechtigte sind. Aber stimmt das? Immer mehr Praxen haben ein WLAN oder ein Powerline-LAN statt eines traditionellen Kabel-LANs. In diesen Fall ist es möglich, dass Unbefugte sich von einem Punkt ausserhalb der Praxis ins Netz einloggen können. Wenn beispielsweise das Personal den Zugang zum Praxisnetzwerk auch nutzen darf, um mit den privaten Mobiltelefonen ins Internet zu gehen, dann sind die Zugangsdaten für Ihr Praxisnetz auf diesen Mobiltelefonen gespeichert. Ein solches Gerät kann mal abhanden kommen. Un sagen Sie nicht "Meine Daten sind nicht wichtig genug für so eine Anstrengung!" Es ist nicht besonders schwer, auf diese Weise einzudringen.

*Fazit*: Eher kabelgebundenes LAN statt WLAN verwenden. Und wenn es WLAN sein muss, die stärkstmögliche Verschlüsselung und lange Zugangsschlüssel verwenden. Und wenn Sie Personal oder gar Patienten einen Access-Point bieten wollen, dann machen Sie das auf keinen Fall mit dem Netzwerk, an dem auch die Praxiscomputer hängen, sondern richten Sie ein Gast-Netzwerk ein, dem sie den Zugriff auf andere Geräte verbieten.

#### Fernzugriff

Sobald Sie auch von ausserhalb der Praxis auf die Daten zugreifen sollen, wird die Sicherungsproblematik etliche Stufen grösser. Jetzt können nicht mehr nur Leute, die physisch in der Nähe der Praxis sind, Einbruchversuche machen, sondern jeder Hacker irgendwo auf der Welt kann sein Glück versuchen. Dabei geht es primär gar nicht unbedingt um Ihre "unwichtigen" Daten. Es gibt zigtausende von automatischen Scanprogrammen, die einfach mal mit den jeweils neuesten Hackmethoden ihr Glück versuchen, und wenn es ihnen gelingt, irgendwo einzubrechen, ihre Besitzer mal nachsehen lassen, was es da wohl zu holen gibt. Sie können sich vermutlich lebhaft vorstellen, was passieren würde, wenn ein Erpresser damit droht, bei Ihnen erbeutete Patientendaten im Internet zu publizieren.

Deshalb: Im Zweifelsfall kein Fernzugriff. Stattdessen eine Firewall, die jeglichen Zugriff von aussen stoppt.

Wenn es aber doch sein muss: Bohren Sie nur ein einziges Loch in die Firewall. Und das auf einem nicht-standard-Port. Durch dieses Loch legen Sie einen SSH- oder VPN Tunnel. Lassen Sie keine Identifikation per Passwort zu, sondern nur per key. Wenn diese Begriffe Ihnen nicht viel sagen, dann machen Sie es nicht selber, sondern beauftragen Sie jemanden damit.

## Der Transport

Wenn Sie ein verschlüsseltes WLAN benutzen, sind Sie diesbezüglich im Vorteil: Die Daten werden dort verschlüsselt übermittelt. Allerdings ist es in den letzten Jahren mehr als einmal vorgekommen, dass Schwachstellen in der WLAN-Verschlüsselung bekannt wurden. Dies ist natürlich auch für die Zukunft möglich. Und wenn Sie nicht gerade ein Sicherheits-Freak sind, besteht eine gewisse Wahrscheinlichkeit, dass Sie lange nichts von einer solchen neuen Schwachstelle in Ihrem Netz erfahren werden, und es gutgläubig weiter benutzen.

Daher erneut die Empfehlung, lieber ein kabelgebundenes LAN zu verwechseln. Diese Kabel mit ihren verdrillten Adern sind kaum abzuhören, und da man genau weiss, wo man Netzwerksteckdosen installiert hat, ist auch jeder mögliche Angriffspunkt bekannt. Wenn das ausnahmsweise nicht der Fall ist, beispielsweise, weil das Netzwerk nicht nur von Ihnen kontrollierte Räume umfasst, dann sollten Sie auf verschlüsselte Kommunikation setzen. Mysql Server in neueren Versionen bieten von sich aus primär verschlüsselte Kommunikation an.

Bei Fernzugriff sind die möglichen Lauscher natürlich um Grössenordnungen zahlreicher. Wenn Sie aber meinen obigen Empfehlungen gefolgt sind, und den Zugriff nur über einen SSH- oder VPN- Tunnel ermöglichen, dann sind die Daten auf dem Transport nach aktuellem Stand der Technik sicher verschlüsselt.

## Entdeckung

Manchmal kann man einen unberechtigten Zugriff nicht verhindern. Wir alle kennen die Geschichten von hochgesicherten Computern, in die Hacker eingedrungen sind. Niemand ist hundertprozentig dagegen gefeit. Aber wenn ein Einbruch geschieht, dann sollte man ihn wenigstens entdecken und zügig unterbinden.

* Machen Sie Ihr Praxispersonal darauf aufmerksam, dass alle Zugriffe auf die Praxiscomputer aufgezeichnet werden (Dazu sind Sie aus rechtlichen Gründen verpflichtet).

* Tun Sie das dann auch. Konfigurieren Sie alle Programme so, dass Logdateien geschrieben werden. Überprüfen Sie diese Logdateien regelmässig auf "verdächtige" Aktionen (Zugriffe zu ungewöhnlichen Zeiten, Benutzer, die mehrmals nacheinander wegen Passwortfehlern abgewiesen werden, ungewöhnliche Aktionen etc.)
Im Fall von Fernzugriff, prüfen Sie auch die SSH/VPN logs darauf hin, wer wann ins Netz eingeloggt ist, und gleichen Sie das mit den Gewohnheiten der berechtigten Personen ab. Von abgewiesenen Login-Versuchen sollten Sie sich allerdings bei SSH/VPN nicht ins Bockshorn jagen lassen: Jeder nach aussen offene Port ist solchen Angriffen ausgesetzt. Würden Sie einen Standardport (22) verwenden, würde Ihr log vermutlich -zig Login-Versuche pro Minute verzeichnen, bei einem nicht-standard-Port immer noch mehrere pro Tag.

Besonders sorgfältige Sicherheitsverantwortliche sichern daher Tunnels durch eine zweite Stufe ab, indem etwa der Tunnel gezielt nur dann geöffnet wird, wenn eine berechtigte Person ihn benötigt. Man kann das mit einer zweiten Kommunikationsebene erreichen, zum Beispiel mit einer SMS oder E-Mail an den Router, der den Tunnel freigibt etc. Lassen Sie sich ggf. beraten.

## Beispielkonfiguration

Hier zur Demonstration eine Beispielkonfiguration für Zugriff auf einen Webelexis-Server

### SSHD - Der SSH Server

Auf dem Server-Computer benötigen Sie einen SSH Server, auch sshd genannt (ssh daemon). Dieser ist bei den meisten Server-Betriebssystemen vorinstalliert oder leicht installierbar. Entscheidend ist die Konfigurationsdatei `/etc/ssh/sshd.config`. Hier nur die interessanten Stellen:

~~~bash
# Irgendein nicht-standard-Port 
Port  39876
# Niemand soll direkt als Administrator einloggen können.
PermitRootLogin no
# Speicherort für die öffentlichen Schlüssel der zugelassenen User
AuthorizedKeysFile     %h/.ssh/authorized_keys
# Zugriff mit Passwort verbieten
PasswordAuthentication no
# Zugriff mit Schlüsselpaar erlauben
RSAAuthentication yes
PubkeyAuthentication yes
~~~

Den Rest können Sie auf den Standardwerten belassen.

Dann müssen Sie auf dem Router den entsprechenden Port (hier 39876) öffnen und zum SSH Server weiterleiten.

### ssh - Der SSH client

Auf Linux- und Mac Computern heisst das entsprechende Programm einfach 'ssh', auf Windows können Sie z.B. 'putty' verwenden. Als Erstes benötigen wir ein Schlüsselpaar.

`ssh-keygen -t rsa`

Wählen Sie als Speicherort z.B. .ssh/webelexiskey

Um den öffentlichen Schlüssel zum Server zu übermitteln, starten Sie den sshd server am Besten ein letztes Mal mit der Option `PasswordAuthentication yes`und führen dann folgendes Programm aus:

`ssh-copy-id -i ~/.ssh/webelexiskey IhrName@IhrPraxisServer.ch`

(Es wird nur der öffentliche Schlüssel zum Server übertragen. Der private Schlüssel bleibt immer auf dem Computer, der ihn erstellt hat, und wird durch Verschlüsselung und begrenzte Zugriffssrecht geschützt)

Nun benötigen wir noch eine Konfigurationsdatei für den SSH Client. Erstellen Sie eine Textdatei names config im Verzeichnins .ssh mit folgendem Inhalt:

~~~bash
Host praxis
        HostName IhrPraxisServer.ch
        User IhrName
        Port 39876
        LocalForward 2018 127.0.0.1:2018
        IdentityFile /Pfad/zu/.ssh/webelexiskey
~~~

Jetzt können Sie sich einfach mit `ssh praxis` auf Ihren Praxis-Server einloggen. Der Tunnel zu Webelexis ist durch die LocalForward-Zeile bereits geöffnet. Allerdings lauscht am anderen Ende noch niemand. Das holen wir jetzt nach:

### Webelexis auf dem Server starten

Erstellen Sie eine Textdatei namens docker-compose.yml mit mindestens folgendem Inhalt:

~~~bash
webelexis:
    image: rgwch/webelexis:3.0.7
    ports: 
      - "2018:3030"
    volumes:
      - /srv/public/webelexis-data:/home/node/webelexis/data
    restart: always
    container_name: d_webelexis

~~~

(Natürlich müssen Sie die "volumes" Angabe anpassen. Im Verzeichnis, auf das Volumes zeigt, muss ausserdem die Konfigurationsdatei settings.js für Webelexis sein.)

Starten Sie dann mit `docker-compose up &` und warten Sie, bis Docker die enstprechende Webelexis-Version heruntergeladen, installiert und gestartet hat.

Möglicherweise müssen Sie dem Docker-User entsprechende Zugriffsrechte auf die Elexis-Datenbank erteilen, z.B.

~~~bash
mysql -u root
create user webelexis@'172.18.0.%' identified by 'supersecret';
grant all on elexis.* to webelexis@'172.18.0.%';

~~~
