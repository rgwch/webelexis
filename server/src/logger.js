const winston=require('winston')


const logger=winston.createLogger({
    level:'debug',

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
