import { PLATFORM } from 'aurelia-pal';

export class App {
  public message: string = 'Hello';
  viewmodel = PLATFORM.moduleName("./components/editor")
  data={
    callback: this.input,
    options: {
      placeholder: "Hier tippseln",
      focus: true,
      mobiledoc: {
        version: "0.3.1",
        markups: [],
        atoms: [],
        cards: [],
        sections: [
          [1, "p", [
            [0, [], 0, "123"]
          ]]
        ]
      }
    }
  }

  public input(text){
    console.log(text)
  }

}
