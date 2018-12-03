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
    const uid=request.params.uuid
    const userService=app.service('usr')
    const user=await userService.get(mail)
    const now=new Date().getTime()
    const ts=user.token.ts
    const diff=now-ts
    if(diff>14400000){
      response.status(410).json({"status":"error","message":"expired"})
    }else{
      if(user.token.uuid!=uid){
        response.status(400).json({status:"error","message":"invalid request"})
      }else{
        // response.redirect("/static/newpwd.html")
        user.token.uuid=uuid()
        user.token.ts=new Date().getTime()
        userService.update(user.email,user).then(updated=>{
          response.render('newpwd',{title: `${defaults.system.sitename}`, user: user.email, uid: user.token.uuid})
        })
      }
    }
    const token=user.token
  })
  app.use("/metadata",(request,response)=>{
    response.json({
      testing: app.get("testing") || false,
      sitename: defaults.system.sitename
    })
  })
}