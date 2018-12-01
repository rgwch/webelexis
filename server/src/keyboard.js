const readline = require('readline')


const ask = prompt => {
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

module.exports=ask
