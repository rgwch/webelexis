import { ElexisType } from "models/elexistype";
import { UserType } from "models/user";
import { DataService, IDataSource, IQueryResult } from "services/datasource";
import { AdapterFactory } from "./adapters/adapter-factory";
import { FhirBundle } from "./model/fhir";
import { FhirService } from "./fhirservice";

export class FhirDS implements IDataSource {

  constructor(private fhir: FhirService){}
  public getService(name: string): DataService {
    const service = new FhirDataService(AdapterFactory.create(name));
    return service;
  }
  public dataType(service: DataService) {
    return service.path;
  }

  public async login(username?: string, password?: string): Promise<UserType>{
    this.fhir.init()
    
    return null
  }

  public async logout() {
    //
  }
}

export interface IFhirAdapter {
  toElexisObject(fhir);
  toFhirObject(obj: ElexisType);
  toQueryResult(bundle: FhirBundle);
}

class FhirDataService implements DataService {
  // get transport name for this DataService's data type
  public path: string;
  constructor(private adapter: IFhirAdapter) {}

  // retrieve an object by ID
  public get(index: string): ElexisType {
    return null;
  }

  // find objects by query expression
  public find(params?): IQueryResult {
    return null;
  }

  // create an object
  public create(data: ElexisType, params?): ElexisType {
    return null;
  }

  // update an object with id
  public update(index, obj): ElexisType {
    return null;
  }

  // Update only given attributes of an existing object
  public patch(index, obj): ElexisType {
    return null;
  }

  // delete an object (or several objects)
  public remove(index, params?): ElexisType {
    return null;
  }
  // send an event concerning an object
  public emit(topic: string, msg: any) {}
  // subscribe on events concerning this DataService's data type
  public on(topic: string, func: (obj: ElexisType) => {}) {}
  // unsubscribe some topics
  public off(topic: string, func: (obj: ElexisType) => {}) {}
}
