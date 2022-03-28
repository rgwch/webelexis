// Initializes the `findings` service on path `/findings`
const createService = require('feathers-nedb')
import createModel from '../../models/findings.model'
import hooks from './findings.hooks'

export default function (app) {
  const Model = createModel(app)
  const paginate = app.get('paginate')

  const options = {
    Model,
    id: 'id',
    paginate,
  }

  // Initialize our service with any options it requires
  app.use('/findings', createService(options))

  // Get our initialized service so that we can register hooks
  const service = app.service('findings')

  service.hooks(hooks)
}
