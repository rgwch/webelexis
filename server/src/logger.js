/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2018 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

const winston=require('winston')

/*
  simple logging configuration. To use this preconfigured logger, don't require 'winston',
  but require('logger')
*/

const logger=winston.createLogger({
    level:'info',

    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.splat(),
      winston.format.simple()
    ),
    transports:[
      new winston.transports.Console()
    ]
  })

  logger.info("Webelexis Server: logger created")
  
module.exports=logger
