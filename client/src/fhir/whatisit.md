# Running Webelexis as FHIR client

Note: This is a highly experimental feature. 

## Switching transport layers

In `aurelia_projects/environment/dev.ts` and/or `prod.ts` change the line: 

      transport: "fhir"

and add/adapt the block:      

      fhir: {
        client_id: "ch.webelexis.aurelia.v3",
        client_redirect: "#/auth",
        server_url: "http://localhost:8380/fhir"
      }

matching your needs. I'd recommend to start with the default values as shown here.

## Finding a FHIR server.

If you want to use the experimental Elexis-Server in demo mode, just run the provided shell script `run-elexis-server.sh` (docker required).

In other cases ask your system administrator or Medelexis AG on how to install or find an elexis server.

## Adding the Webelexis client app

(This assumes that you use the demo-server)


* Grab your mobile phone and get 'Google Authenticator' from the App Store/Play Store.

* Launch your favorite browser and navigate to the [Elexis-Server-Wiki](https://github.com/elexis/elexis-server/wiki/SMART-on-FHIR). Scroll down to the Admin-QR-Code for the demo database and use this as a seed for the Google Authenticator App.


* Navigate to <http://localhost:8380/openid> and log in as **Administrator** with the Password **Admin** and a 2FA-token generated from your mobile app.

* Go to **manage clients** and add a **new client**. Chose any name you like. The client-id is *ch.webelexis.aurelia.v3*, the redirect-URI is *http://localhost:9000/#/auth*. On the "access" page, make sure
the *fhir* scope is selected. In the "credentials"-page, select *no authentication*. Then, **Save** your newly created client.

## Launching and connecting Webelexis with the Elexis Server

Navigate to [http://localhost:9000](http://localhost:9000)
