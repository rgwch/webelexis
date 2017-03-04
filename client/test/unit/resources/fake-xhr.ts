import {XHR} from 'aurelia-http-client';

export class FakeXHR implements XHR {
  status = 200;
  statusText = 'success';
  response = {};
  responseText = 'success';
  onload() {}
  ontimeout() {}
  onerror() {}
  onabort() {}
  abort() {}
  open(method: string, url: string, isAsync: boolean, user?: string, password?: string) {}
  send(content?: any) {}
  constructor(responseBody) {
    this.response = responseBody;
  }
}