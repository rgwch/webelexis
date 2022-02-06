// Initializes the `stickynotes` service on path `/stickynotes`
const { Stickynotes } = require('./stickynotes.class');
import createModel from '../../models/stickynotes.model'
import hooks from './stickynotes.hooks';

export default function (app) {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/stickynotes', new Stickynotes(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('stickynotes');

  service.hooks(hooks);
};
