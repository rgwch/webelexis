import { DataSource,DataService } from "services/datasource";
import { DummyService } from "./dummyservice";

export class Dummysource implements DataSource{

  getService(name: string): DataService {
    return new DummyService();
  }  
  dataType(service: DataService): string {
    return "dummy"
  }
  login(un?: any, pw?: any): Promise<never> {
    throw new Error("Method not implemented.");
  }
  logout(): Promise<never> {
    throw new Error("Method not implemented.");
  }


}
