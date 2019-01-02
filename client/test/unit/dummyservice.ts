import { DataService } from "services/datasource";

export class DummyService implements DataService{

  get(index: string, params?: any) {
    throw new Error("Method not implemented.");
  }  find(params?: any) {
    throw new Error("Method not implemented.");
  }
  create(data: any) {
    throw new Error("Method not implemented.");
  }
  update(index: any, obj: any) {
    throw new Error("Method not implemented.");
  }
  remove(index: any) {
    throw new Error("Method not implemented.");
  }
  emit(topic: any, msg: any) {
    throw new Error("Method not implemented.");
  }
  on(topic: any, func: any) {
    throw new Error("Method not implemented.");
  }
  off(topic: any, func: any) {
    throw new Error("Method not implemented.");
  }
  path: string;


}
