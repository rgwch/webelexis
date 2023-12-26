/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2023 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import createModel from '../../models/article.model'
import { Article } from './article.class';
import hooks from './article.hooks'

export default function (app) {
  const Model = createModel(app);
  const paginate = app.get('paginate');

  const options = {
    Model,
    paginate
  };

  // Initialize our service with any options it requires
  app.use('/article', new Article(options, app));

  // Get our initialized service so that we can register hooks and filters
  const service = app.service('article');

  service.hooks(hooks);
};
