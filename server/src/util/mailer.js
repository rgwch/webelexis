/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

 /**
  * Utility to send mails. We need this primarly to help the user retrieve lost passwords
  */
const nodemailer=require('nodemailer')
const logger=require('../logger')

class Mailer{
  /**
   *
   * @param {host,port,user,pwd} config
   * @param {*} sender
   */
  constructor(config, sender){

    this.sender=sender

    this.smtp={
      host: config.host,
      port: config.port,
      secure: true,
      auth:{
        user: (config.user || process.env.SMTPUSER),
        pass: (config.pwd || process.env.SMTPPASSWORD)
      }
    }
    this.transporter=nodemailer.createTransport(this.smtp)
  }
  send(address,subject,contents, ical){
    const message={
      from: this.sender,
      to: address,
      subject: subject,
      text: contents
    }
    if(ical){
      message.icalEvent={
        filename: "arzttermin.ics",
        method: "publish",
        content: ical
      }
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
