const nconf = require('nconf')
import {Client} from "node-rest-client";

const API = "/api/1.0/"

export class LucindaService {
  private lucinda
  private restClient

  constructor() {
    this.lucinda = nconf.get('lucinda')
    if (this.lucinda) {
      this.restClient = new Client()
    }
  }

  public getDocument(id: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      if (this.lucinda) {
        try {
          this.restClient.get(this.lucinda.server + API + "get/" + id, function (data, response) {
            if (response.statusCode == 200) {
              resolve(data)
            } else {
              reject(new Error(response.statusCode + ", " + response.statusMessage))
            }
          })

        } catch (err) {
          reject(err)
        }
      }
      else {
        //alert("Lucinda Server is not configured")
        reject("Lucinda Server is not configured")
      }

    })
  }


  public searchDocuments(searchexpression: string): Promise<any> {
    return new Promise((resolve, reject) => {
      if (this.lucinda) {
        let args = {
          data: searchexpression,
          headers: {
            "Content-Type": "application/json"
          }
        }
        try {
          this.restClient.post(this.lucinda.server + API + "query", args, function (data, response) {
            if (response.statusCode == 200) {
              resolve(data)
            } else if (response.statusCode == 204) {
              resolve([])
            } else {
              reject(new Error(response.statusCode + ", " + response.statusMessage))
            }
          })
        } catch (err) {
          reject(err)
        }

      } else {
        //alert("Lucinda Server is not configured")
        reject("Lucinda Server is not configured")
      }
    })

  }
}