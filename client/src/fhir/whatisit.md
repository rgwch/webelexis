# Running Webelexis as FHIR client

Note: This is a highly experimental feature. FHIR is rather aimed at exchanging medical data and not for running an EMR-System. So it supports only a subset of the features needed by an EMR Client. Functionality highly depends on the development of Elexis-Server and its ability to handle non-standard-requests.

## Switching transport layers

In `aurelia_projects/environment/dev.ts` and/or `prod.ts` change or add the line: 

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

Webelexis should present you a "Login" Button, and if you press that, redirect you to the Elexis-Server OAuth page, where you have to enter your credentials including a Token from the Google Authenticator (For username and password, try "Administrator/admin" if you use the demo server). After that, you are logged in and Webelexis redirects you to its main page.

## Using the patient list

Try entering "Duck" or "Donald" (without the quotes) into the searchbox in the left panel and press return or click the glass. Please note: In Elexis-Server, searches are case sensitive, so "duck" won't find anything.

# Developer notes

## Concept

The framework reads environemt.ts to decide, which of the pluggable transport systems to use. environment.ts, in turn, is a copy of aurelia_project/environments/dev.ts or prod.ts, depending on the run environment. So never modify environment.ts, since it will be overwritten with every new build. Instead, modify the files in aurelia_project.

Upon launch, the login process is directed (in AuthorizeStep of app.ts) either to fhir/fhir-login or to routes/login/stage1, depending of the entry in environment.ts.

If the trasport is set to fhir, it's the responsibility of adapter-classes to convert between FHIR entities and Webelexis Objects.

Fhir-Entities are based on `FHIR_Resource` (see fhir/model/fhir.ts) while Webelexis Objects are based on `ElexisType` (see models/*).

When Webelexis needs to handle an object of a given type, the fhir/fhir-api/FhirDS (which is an IDataSource) checks, if a DataService for that type exists. If it does, it returns that DataService, which, in turn, can handle CRUD requests on objetcs of that type.

If no such DataService exists, FhirDS creates one, using a matching implementation of fhir/fhir-api/IFhirAdapter. If no matching Adapter is found, it creates and returns a fhir/adapters/empty-adapter/EmptyAdapter. This will do nothing on write requests, return empty Arrays on search and undefined on get.


## Implementation

To enable handling of a given type (say, 'PatientType') for FHIR transport, you'll need the following steps:

* identify a corresponding FHIR_Resource, which is fhir/model/fhir/FHIR_Patient in this example)

* create a 'case' branch in fhir/adapters/adapter-factory/AdapterFactory for that type. Name of the branch must be the Webelexis-Servicename for the datatype, 'patient' in this example.

* create an adapter-class, in this example: fhir/adapters(patient-adapter/PatientAdapter. The Adapter must implement IFhirAdapter, but, for convenience, it can simply extend fhir/adapters/base-adapter/BaseAdapter which contains some utility methods for frequently needed tasks.

An IFhirAdapter must implement the following methods:

*  toElexisObject(fhirObject: FHIR_Resource): ElexisType - Take a FHIR-Resource and return a corresponding ElexisType

*   toFhirObject(elexisObject: ElexisType): FHIR_Resource - Take an ElexisType and return a corresponding FHIR_Resource

*  toQueryResult(bundle: FhirBundle): IQueryResult - Take a FHIR Result bundle and create an IQueryResult from its entries

*  transformQuery(query: any): any - Take a Webelexis Query and convert it to a FHIR conformant query (which is mostly simple a translation of field names)

*  resourceType(): string - return the FHiR resourceType (as defined in FHIR_Resource)

* path: string - the service path / name for the Webelexis Service handling that type


