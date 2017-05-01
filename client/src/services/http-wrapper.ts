/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

import {HttpClient, HttpResponseMessage, RequestMessage} from 'aurelia-http-client';
import {Session} from './session';

export abstract class HttpWrapper {
  httpClient: HttpClient;
  currentToken: string;
  session: Session;

  static inject = [HttpClient, Session];

  constructor(httpClient: HttpClient, session: Session) {
    this.httpClient = httpClient;
    this.session = session;
    this.configure();
  }

  post(url: string, body?) {
    url = this.formatUrl(url);
    let requestBody = {token: this.currentToken};
    Object.assign(requestBody, body);
    return this.httpClient.post(url, body).then(result => {
      return this.handleResponse(result);
    }, error => {
      this.handleError(error);
      return null;
    });
  }

  put(url: string, body?): Promise<any> {
    url = this.formatUrl(url)
    let requestBody = {token: this.currentToken}
    Object.assign(requestBody, body)
    return this.httpClient.put(url, requestBody).then(result => {
      return this.handleResponse(result)
    }, error => {
      this.handleError(error)
      return null
    })
  }

  delete(url: string) : Promise<any>{
    url = this.formatUrl(url)
    return this.httpClient.delete(url).then(result => {
      return this.handleResponse(result)
    }, error => {
      return this.handleError(error)
    })
  }

  get(url: string): Promise<any> {
    url = this.formatUrl(url);
    return this.httpClient.get(url).then(result => {
      return this.handleResponse(result);
    }, error => {
      this.handleError(error);
      return null;
    });
  }

  public configure() {
    let self = this;
    this.httpClient.configure(x => {
      x.withInterceptor({
        request(message: RequestMessage) {
          if (self.session.getUser()) {
            message.headers['headers']['X-sid']={
              key: "X-sid",
              value: self.session.getUser().sid
            }
          }

          return message;
        },
        response(message: HttpResponseMessage) {
          let content = message.content;
          if (content && message.isSuccess == false) {
            self.handleError(message);
            return message;
          }
          return message;
        }
      });
      x.withHeader("accept", "application/json+fhir")
    });
  }

  public abstract formatUrl(url: string): string;

  public handleError(error: HttpResponseMessage) {
    console.log('TODO: Handle Error');
    if(error.statusCode) {
      alert(error.statusCode + ", " + error.statusText)
    }else{
      alert(JSON.stringify(error))
    }
    return null;
  }

  private handleResponse(result: HttpResponseMessage) {
    return result.content;
  }
}
