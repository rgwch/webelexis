/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
import createModel from '../../models/briefe.model'
import hooks from './briefe.hooks';
import { autoImport } from './briefe.util';

export default function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    name: 'briefe',
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/briefe', createService(options));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('briefe');
  service.hooks(hooks);
  /**
   * Create a REST endpoint to fetch individual documents by URL
   */
   app.get("/outgoing/:id", async (req, res) => {
    const doc = await service.get(req.params.id)
    res.set({
      "Content-Type": doc.mimetype,
      "Content-length": doc.contents.length,
      "Content-disposition": "attachment; filename="+doc.betreff
    })
    res.status(200)
    res.send(doc.contents)
    res.end()
  })

  autoImport(app)
};
