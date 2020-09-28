/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2019-2020 by G. Weirich         *
 * License and Terms see LICENSE            *
 ********************************************/

/*
 configuration for the pm2 launcher (used in the dockerized variant)
*/
module.exports = {
  apps : [{
    name: 'server',
    script: 'src/index.js',
    cwd: 'server',
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_dockered: {
      NODE_ENV: 'dockered'
    }
  },{
    name: "selfservice",
    script: "bin/www",
    cwd: 'selfservice',
    instances: 1,
    autorestart: true,
    watch: false,
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production'
    },
    env_dockered: {
      NODE_ENV: 'dockered',
      NODE_APP_INSTANCE: 'dockered'
    }

  }],

};

