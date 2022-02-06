// Initializes the `macros` service on path `/macros`
const createService = require('feathers-nedb')
import createModel from '../../models/macros.model'
import hooks from './macros.hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    id: 'name',
    paginate,
  }

  // Initialize our service with any options it requires
  app.use('/macros', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('macros')

  service.hooks(hooks)
}
