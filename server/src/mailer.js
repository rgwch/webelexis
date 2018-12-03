const nodemailer=require('nodemailer')
const logger=require('./logger')

class Mailer{
  constructor(app, sender){
    this.app=app
    this.sender=sender
    const settings = app.get("userconfig")

    this.smtp={
      host: settings.smtp_host,
      port: settings.smtp,
      secure: false,
      auth:{
        user: process.env.SMTPUSER,
        pass: process.env.SMTPPASSWORD
      }
    }
    this.transporter=nodemailer.createTransport(this.smtp)
  }
  send(address,subject,contents){
    const message={
      from: this.sender,
      to: address,
      subject: subject,
      text: contents
    }
    this.transporter.sendMail(message,(err,info)=>{
      if(err){
        logger.error(err)
      }else{
        logger.info(JSON.stringify(info))
      }
    })
  }
}
module.exports=Mailer
