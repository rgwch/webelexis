// Initializes the `diagnose` service on path `/diagnose`
const createService = require('feathers-knex');
import createModel from '../../models/diagnose.model';
import hooks from './diagnose.hooks';

export default (app) => {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'diagnose',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/diagnose', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('diagnose');

  service.hooks(hooks);
};
