/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const createService = require('feathers-knex');
const createModel = require('../../models/briefe.model');
const hooks = require('./briefe.hooks');
const fs = require('fs')
const path = require('path')
const logger = require('../../logger')
const { DateTime } = require('luxon')
const compilePug = require('../../util/compile-pug')

module.exports = function (app) {
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

  // auto-import templates
  const cfg = app.get("userconfig")
  cfg.mandator = cfg.mandators.default
  if (cfg.docbase) {
    const templatesDir = path.resolve(path.join(cfg.docbase, "templates"))
    fs.readdir(templatesDir, (err, files) => {
      if (err) {
        logger.error("could not read template dir %s:%s", templatesDir, err)
      } else {
        for (const file of files) {
          if (file.endsWith('.pug')) {
            compilePug(templatesDir, file, cfg)
          }
        }
        const templates = []
        for (const file of files) {
          if (file.endsWith(".html")) {
            const basename = path.basename(file, ".html")
            templates.push(matchTemplate(basename))
          }
        }
        Promise.all(templates).then(r => {
          logger.info(`imported ${r.length} templates`)
        })
      }
    })
  }

  const matchTemplate = name => {
    return service.find({ query: { Betreff: name + "_webelexis" } }).then(briefe => {
      if (briefe.data.length > 0) {
        const brief = briefe.data[0]
        if (brief.Path != `templates/${name}.html`) {
          brief.Path = `templates/${name}.html`
          return service.update(brief.id,brief)
        }
      } else {
        const brief = {
          Betreff: name + "_webelexis",
          typ: "Vorlagen",
          Path: `templates/${name}.html`,
          MimeType: "text/html",
          Datum: DateTime.local().toFormat('yyyyLLddhhmmss')
        }
        return service.create(brief)
      }
    })
  }
};
