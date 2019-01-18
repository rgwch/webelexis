import { DataService } from "services/datasource";
import { ElexisType, UUID } from "./elexistype";

export class ObjectManager {

  constructor(protected dataService: DataService) { }

  public async save(el: ElexisType) {
    for (const attr in el) {
      if (el.hasOwnProperty(attr)) {
        if (attr.startsWith("_")) {
          delete el[attr]
        }
      }
    }
    if (el.id) {
      return await this.dataService.update(el.id, el);
    } else {
      return await this.dataService.create(el);
    }
  }

  public async fetch(id: UUID) {
    return await this.dataService.get(id)
  }
}
