import { bootstrap } from 'aurelia-bootstrapper';
import { StageComponent } from 'aurelia-testing';
import { PLATFORM } from 'aurelia-pal';
import { ContextReplacementPlugin } from 'webpack';

describe("Editor component", () => {
  let component
  let dirigent
  const options = {
    callback: modified,
    commands: commands,
    plaintext: "Check"
  }

  beforeEach(() => {
    component = StageComponent
      .withResources(PLATFORM.moduleName('components/editor'))
      .inView('<editor config.bind="options"></editor>')
      .boundTo({options:options});
  });

  afterEach(() => component.dispose());

  it('should create and modify an editor', done => {
    return component.create(bootstrap).then(() => {
      const view = component.element
      const text=view.querySelector("p").innerHTML
      expect(text).toBe("123")
      dirigent({mode: "replace",text:"Hello"})
      const text2=view.querySelector("p").innerHTML
      expect(text2).toBe("Hello")
      dirigent({mode: "insert", text: "ei", pos: 3})
      const text3=view.querySelector("p").innerHTML
      expect(text3).toBe("Heleilo")
      done()
    }).catch(e => {
      fail(e)
      done()
    })
  })

  
  function commands(cmd) {
    dirigent=cmd  
  }
})

function modified(txt) {
  console.log("modified")
}

