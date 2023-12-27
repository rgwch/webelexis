/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2023 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
import createModel from '../../models/cash.model'
import hooks from './cash.hooks';

export default (app) => {
    const Model = createModel(app);
    const paginate = app.get('paginate');

    const options = {
        name: 'ch_elexis_kassenbuch',
        Model,
        paginate
    };

    // Initialize our service with any options it requires
    app.use('/kassenbuch', createService(options));

    // Get our initialized service so that we can register hooks and filters
    const service = app.service('kassenbuch');

    service.hooks(hooks);
};
