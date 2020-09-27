// Initializes the `lucinda` service on path `/lucinda`
const createService = require('./lucinda.class.js');
const hooks = require('./lucinda.hooks');

module.exports = function (app) {

  const options = app.get("lucinda")
  // Initialize our service with any options it requires
  app.use('/lucinda', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('lucinda');
  app.get("/lucindadoc/:id", async (req, res) => {
    const doc = await service.get(req.params.id)
    res.set({
      "Content-Type": "application/pdf",
      "Content-length": doc.length
    })
    res.status(200)
    res.send(doc)
    res.end()
  })


  service.hooks(hooks);
};
