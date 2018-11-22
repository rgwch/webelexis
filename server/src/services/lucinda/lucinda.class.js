const request = require('request')
const fs = require('fs')
const getUri = require('get-uri')
const uuid = require('uuid/v4')

/* eslint-disable no-unused-vars */
class Service {
  constructor(options) {
    this.options = options || {};
  }

  async find(params) {
    return [];
  }

  get(id, params) {
    if (id == "info") {
      return new Promise((resolve, reject) => {
        request(this.options.url + "ping", (err, result) => {
          if (err) {
            reject(err)
          }
          if (result) {
            resolve(result.body)
          }
        })
      })
    }else{
      return new Promise((resolve,reject)=>{
        request.get(this.options.url+"get/"+id,(err,result)=>{
          if(err) reject(err)
          if(result){
            if(result.statusCode == 200){
              resolve(result.body)
            }else{
              reject("not found")
            }
          }
        })
      })
    }
  }

  create(data, params) {
    if (Array.isArray(data)) {
      return Promise.all(data.map(current => this.create(current, params)));
    }
    return new Promise((resolve, reject) => {
      request({
        method: "POST",
        uri: this.options.url + "addfile",
        body: data,
        json: true
      }, (err, result) => {
        if (err) {
          reject(err)
        }
        if (result) {
          resolve(result)
        }
      })
    })

  }

  async update(id, data, params) {
    return data;
  }

  async patch(id, data, params) {
    return data;
  }

  remove(id, params) {
    return new Promise((resolve,reject)=>{
      
    })
  }
}

module.exports = function (options) {
  return new Service(options);
};

module.exports.Service = Service;
