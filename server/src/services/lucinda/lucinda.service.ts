// Initializes the `lucinda` service on path `/lucinda`
import createService from './lucinda.class';
import hooks from './lucinda.hooks';

export default function (app) {

  const options = app.get("lucinda")
  // Initialize our service with any options it requires
  app.use('/lucinda', createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service('lucinda');

  /**
   * Create a REST endpoint to fetch individual documents by URL
   */
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
