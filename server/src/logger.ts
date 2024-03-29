/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import winston from 'winston'
/*
  simple logging configuration. To use this preconfigured logger, don't require 'winston',
  but require('logger')
*/

export const logger = winston.createLogger({
  level: (process.env.NODE_ENV==="debug") ? 'debug' : 'info',
  silent: false,
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.splat(),
    winston.format.simple(),
  ),
  transports: [new winston.transports.Console({ silent: false })],
})

logger.info('Webelexis Server: logger created')
