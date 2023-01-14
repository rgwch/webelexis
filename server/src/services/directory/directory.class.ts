import fs from 'fs'
import path from 'path'

export class Directory {
  constructor(private app, private options) {

  }

  async get(id: string, params?: any) {
    return new Promise((resolve, reject) => {
      fs.readFile(path.join(this.options.dir, id), (err, contents: Buffer) => {
        if (err) {
          reject(err)
        } else {
          resolve(contents)
        }
      })
    })
  }

  async create(file: Buffer, params?: any) {
    return new Promise((resolve, reject) => {
      reject("not implemented")
    })
  }
  async find(params: any) {
    return new Promise((resolve, reject) => {
      reject("mot implemented")
    })
  }
}
