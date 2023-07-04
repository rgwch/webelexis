/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * 'npm start' will execute this script
 */
import * as dotenv from 'dotenv'
dotenv.config({ path: "../.env", debug: true })
import app from './app';
import https from 'https'
const port = app.get('port');
const ssl = process.env.NODE_MODE === "SSL"
import { logger } from './logger'
import fs from 'fs'

console.log("Mode: " + process.env.NODE_MODE)
let server
if (ssl) {
  server = https.createServer(
    {
      key: fs.readFileSync("privatekey.pem"),
      cert: fs.readFileSync("certificate.pem")
    },
    app
  ).listen(3443)
  process.on('unhandledRejection', (reason, p) =>
    logger.error('Unhandled Rejection at: Promise ', p, reason)
  );
  app.setup(ssl)
} else {
  server = app.listen(port);
}

server.on('listening', () =>
  logger.info('Webelexis Server started on http://%s:%d; Mode: %s', app.get('host'), port, ssl ? "https" : "http")
);