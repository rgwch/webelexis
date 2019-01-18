import { DataService } from "services/datasource";
import { ElexisType } from "./elexistype";

export class ObjectManager {
  //protected dataService: DataService

  constructor(protected dataService: DataService) {
    
  }

  public async save(el: ElexisType) {
    if (el.id) {
      return this.dataService.update(el.id, el);
    } else {
      return this.dataService.create(el);
    }
  }
  // protected dataService = () => this.data

}
