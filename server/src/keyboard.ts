/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2022 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

/**
 * utility to read data from the server console. We need this primarly to initalize an administrator
 * account.
 */
import readline from 'readline'

export default prompt => {
  return new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    rl.question(prompt, answer => {
      rl.close()
      resolve(answer)
    })

  })
}


