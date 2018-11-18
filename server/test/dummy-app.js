const feathers = require('@feathersjs/feathers')
const realApp=require('../src/app')
const knex = require('feathers-knex');


const paginate = {
  "default": 50,
  "max": 100
}
const tarmed={
  name:'tarmed',
  Model: realApp.get('knexClient'),
  paginate
}

const article={
  name: "artikelstamm_ch",
  Model: realApp.get('knexClient'),
  paginate
}

class FallService {
  async get(id, params) {
    return {
      id: "007",
      gesetz: "KVG"
    }
  }
}

const app=feathers()
app.set("paginate",paginate)
app.use('/fall', new FallService())
app.use('/tarmed', knex(tarmed))
app.use('/article', knex(article))

module.exports=app
