import {HttpWrapper} from './http-wrapper';

export class LocalHttpWrapper extends HttpWrapper {
  formatUrl(url:string) {
    if(url==='dologin' || url === "configuration"){
      return `http://localhost:3000/${url}`
    }else {
      return `http://localhost:3000/fhir/${url}`
    }
  }
}
