// Initializes the `leistungsblock` service on path `/leistungsblock`
const createService = require('feathers-knex');
import createModel from '../../models/leistungsblock.model'
import hooks from './leistungsblock.hooks'

export default function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'leistungsblock',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/leistungsblock', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('leistungsblock');

  service.hooks(hooks);
};
