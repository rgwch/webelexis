/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { logger } from '../logger'
import { Mailer } from '../util/mailer'
import { v4 as uuid } from 'uuid'
import { hasRight } from '../util/acl'

export default function (app) {
  const roles=app.get("roles")
  app.get('/lostpwd/:mail', async (request, reply) => {
    const usermail = request.params.mail
    logger.info('Password reset requested ' + usermail)
    try {
      const userService = app.service('user')
      const user = await userService.get(usermail)

      const token = {
        uuid: uuid(),
        ts: new Date().getTime(),
      }
      user.token = token
      await userService.update(user.email, user)
      const mailer = new Mailer(app, app.get("admin"))
      const body = `Bitte folgen Sie innert 4 Stunden diesem Link: ${app.get("url")}, um Ihr Passwort zurückzusetzen.`
      const result = await mailer.send(
        usermail,
        'Webelexis Passwort Wiederherstellung',
        body,
      )
      reply.send(
        'Sie erhalten in Kürze eine Mail mit Anweisungen, wie Sie Ihr Passwort zurücksetzen können.',
      )
    } catch (err) {
      logger.warn('Mailer: ' + err)
      reply.status(404).json({ status: 'error', message: 'Not found' })
    }
  })
  app.get('/resetpwd/:mail/:uuid', async (request, response) => {
    const mail = request.params.mail
    const uid = request.params.uuid
    const userService = app.service('user')
    const user = await userService.get(mail)
    const now = new Date().getTime()
    const ts = user.token.ts
    const diff = now - ts
    if (diff > 14400000) {
      response.status(410).json({ status: 'error', message: 'expired' })
    } else {
      if (user.token.uuid != uid) {
        response
          .status(400)
          .render('error', { status: 'error', message: 'invalid request' })
      } else {
        // response.redirect("/static/newpwd.html")
        user.token.uuid = uuid()
        user.token.ts = new Date().getTime()
        userService.update(user.email, user).then((updated) => {
          response.render('newpwd', {
            title: `${app.get("sitename")}`,
            user: user.email,
            uid: user.token.uuid,
          })
        })
      }
    }
    const token = user.token
  })
  app.post('/chpwd', async (request, response) => {
    const uid = request.body.uid
    const uname = request.body.uname
    const password = request.body.password
    const repeat = request.body.password2
    const userService = app.service('user')
    const user = await userService.get(uname)
    const ts = user.token.ts
    const now = new Date().getTime()
    const diff = now - ts
    if (diff > 300000) {
      response.status(410).render('error', { message: 'expired' })
    } else {
      if (user.token.uuid === uid) {
        if (password === repeat) {
          user.password = password
          const updated = await userService.update(uname, user)
          response.render('pwdok')
        } else {
          response.render('error', { message: "Passwords don't match" })
        }
      } else {
        response
          .status(400)
          .json({ status: 'error', message: 'invalid request' })
      }
    }
  })
  app.get('/metadata', (request, response) => {
    const testing=app.get("testing") || false;
    const sitename= app.get("sitename") || "Webelexis Test";
    const admin= app.get("admin") || "Somebody";
    const autologin= app.get("autologin") || {};
    const ip= request.ip;
    response.json({
      testing,sitename,admin,autologin,ip,roles
    })
  })
}
