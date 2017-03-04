import {HttpWrapper} from './http-wrapper';
import {Config} from '../config';


export class DevHttpWrapper extends HttpWrapper {
  formatUrl(url:string) {

    if (url.startsWith("loginuser")) {
      return "/mock-api/" + url + ".json";
    } else {
      if (url.match(/[A-Z][a-z]+\?[a-zA-Z0-9_]+/)) {
        return "/mock-api/" + url.toLowerCase().substring(0, url.indexOf('?')) + "/filter.json"
      } else {
        let pattern = /[A-Z][a-z]+\/([a-zA-Z0-9_\-]+)/
        let result = pattern.exec(url)
        if (result == null || result.length < 2) {
          return "/mock-api/" + url.toLowerCase().substr(0, url.indexOf('/')) + "/detail.json"
        } else {
          return `/mock-api/${url.toLowerCase().substr(0, url.indexOf('/'))}/${result[1]}.json`
        }
      }
    }

  }

  put(url,body){
    // do nothing
    return new Promise(function(resolve){
      resolve(body)
    })
  }


  post(url,body) {
    // catch "fhir create": create an arbitrary id for the supplied resource,
    if(url.match(/[A-Z][a-z]+/)){
      body.id='xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(16);
      });
      return new Promise(function(resolve){
        resolve(body)
      })
    }
  }


}
