# The Webelexis Developer's Handbook

## Prerequisites, install and launch

node >= 10
jdk >=8
elexis running on a slightly modified mysql database (source `server/modify_elexis.sql` for the modifications)

... as needed ...:

    cd server
    npm install
    npm rebuild node-sass
    npm remove java
    npm install java
    cd lib
    ./fetch.sh
    cd ..
    npm start

the development server runs on port 3030

    cd ../client
    npm install
    au run --watch --hmr

the webpack development server runs on port 9000    

## Deployment

      cd client
      au build -env prod
      cd ../server
      sudo npm run prod


## SQL Server

Webelexis-Server connects to an existing Elexis(tm) database or creates one from scratch. 

Webelexis-Server uses [Knex](http://knexjs.org) as a persistence layer and thus is able to work with all database systems supported by Knex. The configuration of the database is  in server/config/*.json and the decision which database to use is configured in /server/src/knex.js.

## General Layout and where to start - Client

Let's diskuss the startup and login first (all in the src folder):

The Application's life cycle starts with main.ts. Aurelia configuration finds place and then, control proceeds to app.ts. 
App.ts implicitely initiates a Session (by injecting the Session Singleton in the constructor). Then it loads metadata about the running system from the server and configures the router. The AuthorizeStep class at the bottom of the file is called before routing and tries to get the logged in user. If a valid JWT token is in LokalStorage, Session will retrieve that token and log the respective user in. If this doesn't succeed, AuthorizeStep redirects the router to the login-page.

The Login Page (src/routes/user/login) operates in two modes: If the server runs in "testing" mode, then it has created an "admin", "user@webelexis.ch" and "guest@webelexis.ch" with the passwords "admin", "user" and "guest". In this case, the client offers to login by simply pressing a button. If the server runs in productive mode, a login page is presented.

If a logged-in user was found or login succeds, the default page (routes/dispatch) is created. The page consists of a lefgt and a right part which are set individually by an aurelia compose pattern. (See rooutes/dispatch/left and routes/dispatch/right)




## DataSource and DataService

To apply CRUD operations on data, we first need to acquire the respective datatype from our DataSource. The DataSource ist preconfigured depending on the server implementation.

````
import {DataSource,DataService} from '../services/datasource'
import {autoinject} from 'aurelia-framework'

@autoinject
export class DoSomething{

  private service:DataService

  constructor(private ds:DataSource){
    this.service=ds.getService('ServiceName')
  }

  async actOnData(object){
    const created= await this.service.create(object);
    const fetched= await this.service.get(object.id);
    const updated= await this.service.update(object.id,newObject)
    const found = await this.service.find({query:{someAttribute: "someValue"}})
    const deleted = await this.service.remove(object.id)
  }
} 
````

## Events on stored objects

The DataService sends events about all objects it manages to all authenticated and authorized clients. To subscribe to an event, use something like:

````
exampleService:DataService

constructor(private ds:DataSource){
  this.exampleService=ds.getService('example')
  this.exampleService.on('created',this.objectWasCreatedFunc)
  this.exampleService.on('updated',this.objectWasUpdatedFunc)
  this.exampleService.on('patched',this.objectWasPatchedFunc)
  this.exampleService.on('removed',this.objectWasRemovedFunc)
}

objectWasCreatedFunc(obj){
  console.log("An object is born! "+JSON.stringify(obj))
}

````


## State

State is maintained by an instance of aurelia-store.  To follow the state of a random object, use something like the following code:

~~~~
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';


@connectTo(store=>store.state.pipe(<any>pluck("something")))
export class SomethingHandler{

  /* 
    do something with 'state' which is the currently
    selected instance of 'something'.
   */ 
}
~~~~

If you want the complete state instead, things are even simpler:

~~~~
import { connectTo } from 'aurelia-store';
import {State} from ('../state')

@connectTo<State>()
export class SomeStateHandler{

  /* 
    do something with 'state' which is the complete current
    state of Webelexis.
   */ 
}
~~~~

If you're interested in a number of objects only, use something similar to:

~~~~
@connectTo<State>({
  selector: {
    actPatient: store => store.state.pipe(<any>pluck('patient')),
    actCase: store=>store.state.pipe(<any>pluck('case')),
    actKons: store => store.state.pipe(<any>pluck('konsultation'))
  }
})
~~~~

State objects are implicitly @observable, which means, you can monitor them with code like this:

````
actPatientChanged(newState,oldState){
  // do something
}
````

## Data types

### Finding

A finding is a type of data generated externally and repeatedly over time. Examples might be the Blood Pressure, or the body weight.

To record such data, we need:

* a finding definition (see src/models/finding-def.ts) for each finding type to use, which tells the system, how to set up the data structure.

* a list of such finding definitions (src/user/finding-defs.ts) to tell the system, which findings to manage. This list is user-supplied and must be created upon installation of the system.

* One concrete finding object (src/models/findings-model.ts/FindingType) for each finding type.

Helpers to manage findings are in findings-model: Finding-Manager and Finding-Model.

## Localization

### Setup

Translation files are in the directory /locales. There is a subdirectory for each supported languange with the ISO abbreviation, e.g. 'de' for german, 'en' for english and so on. More fine-grained translations are also possible, e.g. 'de_CH' or 'en_US'. To support a language, simply create a subdirectory for that language and copy 'translation.json' from 'de'. Then, change all values in that file to the new language (but leave the keys as-is).

German is defined as the fallback. So if a key is not found in the current language, the german version is displayed.

### Usage

We use aurelia-i18n, so a lot of documentation can be found there. Here only a short overview:

To translate html-files, use the t-attribute, e.g.

    <h2 t="some.title">Title</h2> 

This would look for

    "some":{
      "title": "Some Title"
    }

In the translation.json of the currently selected language. If it doesn't find that, it looks for the same object in translation.json of the "de" subdirectory. If still not founs, it displays simply "some.title" as the title. It will not show "Title" as probably expected. And the inner contents of the tag is completely optional. so `<h2 t="some.title>"></h2>` would yield exactly the same result.

To translate programmatically, use the I18N singleton:

    import {autoinject} from 'aurelia-framework'
    import {i18N} from 'aurelia-i18n'

    @autoinject
    export class SomeClass{
      constructor(private i18:I18N){}

      someOutput(){
        return this.i18.tr("some.title")
      }
    }

  Parameters are defined like this:

      "example":{
        "reallydelete": "Wollen Sie {{dingsbums}} wirklich löschen?"
      }  

  and consume it like this:

    <p t="example.reallydelete" t.params.bind="params">

 where params are defined in the matching ViewModel, such as:

    class Something{
      params = {
        dingsbums: "Windows 10"
      }
    }   

Similarly, programmatically replace parameters like this:

    someOutput(){
      this.i18.tr("example.reallydelete",params)
    }

To localize dates, use markup like this:


    <p>Heute ist der ${new Date() | df : undefined : 'de'}</p>

## Dialogs

We use aurelia-dialog as a common dialog interface.

### caller

````
import { DialogService } from 'aurelia-dialog'
import {SomeDialog} from '../dialogs/some-dialog'
import {autoinject} from 'aurelia-framework'
...
constructor(private dlgs:DialogService){}

dlgTriggered(){
  this.dlgs.open({ViewModel: SomeDialog, model: someModel}).whenClosed(response=>{
    if(response.wasCancelled){
      console.log("cancel or close button pressed")
    }else{
      console.log("ok pressed")
      // do something with response.output
    }
  })
}
````

### Dialog

SomeDialog.html

```
<template>
  <ux-dialog>
    <ux-dialog-header>
      <h3>Header</h3>
    </ux-dialog-header>
    <ux-dialog-body>
      <div class="form-group row">
        <label for="meta_subject" class="col-form-label">Subject</label>
        <input id="meta_subject" type="text" class="form-control" value=data.subject>
      </div>
      <div class="form-group row">
        <label for="meta_other" class="col-form-label">Other</label>
        <input id="meta_other" class="form-control" type="text" value=data.other>
      </div>
    </ux-dialog-body>
    <ux-dialog-footer>
      <button click.trigger="dc.cancel()">Cancel</button>
      <button click.trigger="dc.ok(data)">Ok</button>
    </ux-dialog-footer>
  </ux-dialog>
</template>
```

SomeDialog.ts

```
import { DialogController } from 'aurelia-dialog'
import { autoinject} from 'aurelia-framework';

@autoinject
export class SomeDialog{
  data

  constructor(private dc:DialogController){}

  activate(data){
    this.data=data
  }

  ok(data){
    // some cleanup if necessary
    this.dc.ok(data)
  }
}
```
## Billing

The billing systems consists of 'billables' - code elements that might be billed, such as tarmed code, articles and so on. And of 'billings' which are kind of materialized billables, i.e. billables applied to a given encounter.

To create a billing, first retrieve an encounter and a billable and then apply create on the service billing with that billable.

To incorporate new billing systems, just implement an adapter for that billing system in server/src/services/billing


## Documents

## Access control system

Webelexis relies on an ability based access control system: A resource is protected by an Access Control Element (ACE). A collection of such elements is called ACL (Access Control List). A user has one or more roles. A role is linked to an ACL. ACEs are hierarchically organized. An ACE contains implicitly all children ACEs and so on. The top ACE is the root. The admin role has the root ACE and therefore all other ACEs.

ACEs are created in services/index.js. Every service can define up to 6 ACEs: get,find,create,update,patch and remove.

The definition of roles is installation dependend and therefore in the user configurable area: server/config/roles.js defines roles and their names, and Aclmapper defined mappings of ACE to roles.

**Important**: The roles should be set up before starting the system. Once some objects are created, changes of the role system can lead to errors. The aclmapper on the other hand, can easiliy be changed at any time.

