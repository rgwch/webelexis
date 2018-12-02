const logger=require('../logger')
const Mailer=require('../mailer')
const defaults=require('../../config/elexisdefaults')
const uuid=require('uuid/v4')

module.exports=function(app){

  app.use("/lostpwd/:mail",(request,reply)=>{
    const mail=request.params.mail
  logger.info("Password reset requested "+mail)
  const userService=app.service('usr')
  userService.get(mail).then(user=>{
      const token={
        uuid: uuid(),
        ts: new Date().getTime()
      }
      user.token=token
      userService.update(user.email,user).then(updated=>{

      })
      const mailer=new Mailer(defaults.system.admin)
      const mail=`Bitte folgen Sie innert 4 Stunden diesem Link: ${defaults.system.url}, um Ihr Passwort zurückzusetzen.`
      mailer.send(mail,"Webelexis Passwort Wiederherstellung")
      reply.send("Sie erhalten in Kürze eine Mail mit Anweisungen, wie Sie Ihr Passwort zurücksetzen können.")
    }).catch(notfound=>{
      reply.status(404).json({status:"error",message: "Not found"})
    })
  })
  app.use("/resetpwd/:mail/:uuid",async (request,response)=>{
    const mail=request.params.mail
    const uuid=request.params.uuid
    const userService=app.service('usr')
    const user=await userService.get(mail)
    const now=new Date().getTime()
    const ts=user.token.ts
    const diff=now-ts
    if(diff>14400000){
      response.status(410).json({"status":"error","message":"expired"})
    }else{
      if(user.token.uuid!=uuid){
        response.status(400).json({status:"error","message":"invalid request"})
      }else{
        response.render("newpwd")
      }
    }
    const token=user.token
  })
}
