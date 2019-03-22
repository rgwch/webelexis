module.exports = {
  apps : [{
    name: 'serv',
    script: 'src/index.js',
    cwd: 'server',
    instances: 1,
    autorestart: true,
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
    name: "self",
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
      NODE_ENV: 'dockered'
    }

  }],

};

