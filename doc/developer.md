# The Webelexis Developer's Handbook

## Prerequisites

node >= 10
jdk >=8

npm rebuild node-sass
npm remove java
npm install java


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

## State

State is maintained by an instance of aurelia-store.  To follow the state of a random object, use something like the following code:

~~~~
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';


@connectTo(store=>store.state.pipe(pluck("something")))
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
    actPatient: store => store.state.pipe(pluck('patient')),
    actCase: store=>store.state.pipe(pluck('case')),
    actKons: store => store.state.pipe(pluck('konsultation'))
  }
})
~~~~

State objects are implicitly @observable, which means, you can monitor them with code like this:

````
actPatientChanged(newState,oldState){
  // do something
}
````
