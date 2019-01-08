import { UserType } from "models/user";
import { DataService, IDataSource } from "./datasource";

export class FhirDS implements IDataSource {
  public getService(name: string): DataService {
    throw new Error("Not implemented");
  }
  public dataType(service: DataService) {
    return service.path;
  }

  public async login(username?: string, password?: string): Promise<UserType> {
    throw new Error("not implemented");
  }

  public async logout() {
    //
  }
}
