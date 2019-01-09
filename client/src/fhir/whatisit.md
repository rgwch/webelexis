# Running Webelexis as FHIR client

Note: This is a highly experimental feature. 

## Switching transport layers

In aurelia_projects/environment/dev.ts and/or prod.ts change the line: 

      transport: fhir

and add/adapt the block:      

      fhir: {
        client_id: "ch.webelexis.aurelia.v3",
        client_redirect: "#/auth",
        server_url: "http://localhost:8380/fhir"
      }

matching your needs.

## Finding a FHIR server.

If you want to use the experimental Elexis-Server in demo mode, just run the provided shell script run-elexis-server.sh (docker required).

In other cases ask your system administrator or Medelexis AG on how to install or find an elexis server.

