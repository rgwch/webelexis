// Initializes the `invoice` service on path `/invoice`
import createService from './invoice.class'
import hooks from './invoice.hooks'

export default function (app) {

  const paginate = app.get('paginate');

  const options = {
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/invoice', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('invoice');

  service.hooks(hooks);
};
