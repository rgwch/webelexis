/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * 'npm start' will execute this script
 */
import * as dotenv from 'dotenv'
dotenv.config({path: "../.env", debug: true})
import app from './app';
const port = app.get('port');
const server = app.listen(port);
import { logger } from './logger'

process.on('unhandledRejection', (reason, p) =>
  logger.error('Unhandled Rejection at: Promise ', p, reason)
);

server.on('listening', () =>
  logger.info('Webelexis Server started on http://%s:%d', app.get('host'), port)
);
