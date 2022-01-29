
describe("Setup check",()=>{
  it ("should reject",()=>{
    expect(check()).rejects.toMatch("blah")
  })  
})
  function check(){
    return new Promise((resolve,reject)=>{
      reject("blah")
    })
  }

  
