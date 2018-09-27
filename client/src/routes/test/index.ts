export class Test{

  liste=[]
  end=0
  constructor(){
    for(let i=0;i<50;i++){
      this.liste.push(i)
    }
    this.end=50
  }

  loadData(pos){
    console.log("loader")
    for(let i=0;i<50;i++){
      this.liste.push(this.end+i)
    }
    this.end+=50
  }
}
