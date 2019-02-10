const logger = require("./logger")

module.exports = async app => {
  const modify = async tableName => {
    const columns = await knex.table(tableName).columnInfo()
    for (const key of Object.keys(columns)) {
      if (key.toLocaleLowerCase() !== key) {
        try {
          await knex.schema.table(tableName, table => {
            table.renameColumn(key, key.toLocaleLowerCase())
            logger.info("changed "+tableName+"."+key)
          })
        } catch (err) {
          logger.error(err)
        }
      }
    }
  }

  const knex = app.get("knexClient")
  const query = "SELECT table_name FROM information_schema.tables WHERE table_schema = ?"
  const bindings = [knex.client.database()]
  return knex.raw(query, bindings).then(function(results) {
    const tableNames = results[0].map(row => {
      return modify(row.TABLE_NAME)
    })
    return Promise.all(tableNames)
      .then()
      .catch(err => {
        logger.error(err)
      })
  }).catch(err=>{
    logger.error(err)
  })
}
