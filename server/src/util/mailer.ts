/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * Utility to send mails. We need this primarly to help the user retrieve lost passwords
 */
import nodemailer from 'nodemailer'
import { logger } from '../logger'

export type Attachment = {
  filename: string
  content?: Buffer | string
  path?: string
}
export class Mailer {
  /**
   *
   * @param {{host,port,user,pwd}} config
   * @param {*} sender
   */
  private smtp
  private transporter
  constructor(private config, private sender) {
    this.sender = sender

    this.smtp = {
      host: config.host,
      port: config.port,
      secure: true,
      auth: {
        user: config.user || process.env.SMTPUSER,
        pass: config.pwd || process.env.SMTPPASSWORD,
      },
    }
    this.transporter = nodemailer.createTransport(this.smtp)
  }
  async send(
    address: string,
    subject: string,
    contents: string,
    attachment?: Attachment,
    ical?,
  ): Promise<any> {
    const message = {
      from: this.sender,
      to: address,
      subject: subject,
      text: contents,
    }
    if (ical) {
      message['icalEvent'] = {
        filename: 'arzttermin.ics',
        method: 'publish',
        content: ical,
      }
    }
    if (attachment) {
      message['attachments'] = [attachment]
    }
    const result = await this.transporter.sendMail(message)
    return result
  }
}
