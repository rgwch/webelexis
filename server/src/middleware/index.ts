import design from './design';

export default function (app) {
  app.get("/test",(req,reply)=>{
    reply.json({"status":"Hups"})
  })
  app.use('/home/design', design());
};
