const chai=require('chai')
const promised=require('chai-as-promised')
chai.use(promised)
const expect=chai.expect()
chai.should()

  function check(){
    return new Promise((resolve,reject)=>{
      reject("blah")
    })
  }

  check().should.be.rejectedWith("blah")

