import { PLATFORM } from 'aurelia-pal';

export class App {
  public message: string = 'Hello';
  viewmodel = PLATFORM.moduleName("./components/editor")
  private cmdinterface
  data = {
    callback: this.input,
    commands: this.commands,
    plaintext: "Hallo Editor"
  }

  public input(text) {
    console.log(text)

  }

  public commands(func) {
    this.cmdinterface = func
    setTimeout(() => {
      this.cmdinterface({ mode: "log", text: "Command works" })
      this.cmdinterface({ mode: "insert", pos: 3, text: "inserted" })
    }, 3000)
    
    setTimeout(() => {
      this.cmdinterface({ mode: "log", text: "Command works" })
      this.cmdinterface({ mode: "replace", text: "Replaced!" })
    }, 4000)
  
  }



}
