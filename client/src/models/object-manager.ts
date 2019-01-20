import { DataService, DataSource } from "services/datasource";
import { ElexisType, UUID } from "./elexistype";
import { Container } from "aurelia-framework";

export class ObjectManager {
  protected dataService: DataService;
  protected dataSource: DataSource

  constructor(serviceName: string) {
    this.dataSource = Container.instance.get(DataSource);
    this.dataService = this.dataSource.getService(serviceName);
  }

  public async save(el: ElexisType) {
    for (const attr in el) {
      if (el.hasOwnProperty(attr)) {
        if (attr.startsWith("_")) {
          delete el[attr];
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
    return await this.dataService.get(id);
  }

  public async remove(el: ElexisType) {
    return await this.dataService.remove(el.id)
  }
}
