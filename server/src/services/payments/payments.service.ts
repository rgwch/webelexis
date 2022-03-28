// Initializes the `payments` service on path `/payments`
const { Payments } = require('./payments.class');
import createModel from '../../models/payments.model'
import hooks from './payments.hooks'

export default (app)=> {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/payments', new Payments(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('payments');

  service.hooks(hooks);
};
