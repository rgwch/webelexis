const design = require('./design');
module.exports = function (app) {
  app.get("/test",(req,reply)=>{
    reply.json({"status":"Hups"})
  })
  app.use('/home/design', design());
};
