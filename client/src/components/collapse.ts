
export class Collapse{
  isExpanded:boolean=false

  toggle(){
    this.isExpanded=!this.isExpanded
    console.log("toggle")
  }
}
