import {FlexformConfig} from '../flexform'
import { bindable, computedFrom } from 'aurelia-framework';
import { connectTo } from 'aurelia-store';
import { pluck } from 'rxjs/operators';
import * as num from 'numeral'

@connectTo(store=>store.state.pipe(pluck("article")))
export class ArtikelDetail{
  @bindable article;
  money={
    toForm: (val)=>num(val).format("0.00"),
    toData: (val)=>num(val).value()
  }
  smallcols="xs-6 sm-4 md-2"
  ff:FlexformConfig={
    title: ()=>this.title,
    attributes:[
      {
        attribute: "DSCR",
        label: "Name",
        sizehint: 12
      },{
        attribute: "PEXF",
        label: "Ex factory Preis",
        sizehint: this.smallcols,
        datatype: this.money
      },{
        attribute: "PPUB",
        label: "Publikumspreis",
        sizehint: this.smallcols,
        datatype: this.money
      },{
        attribute: "PKG_SIZE",
        label: "Packungsgrösse",
        sizehint: this.smallcols,
      },{
        attribute: "Istbestand",
        label: "Lagerbestand",
        sizehint: this.smallcols,
      },{
        attribute: "Maxbestand",
        label: "Maxbestand",
        sizehint: this.smallcols,
      },{
        attribute: "Minbestand",
        label: "Minbestand",
        sizehint: this.smallcols,
      },{
        attribute: "Anbruch",
        label: "Anbruch",
        sizehint: this.smallcols,
      }

    ]
  }
  @computedFrom('obj')
  get title(){
    return "Artikeldetails"
  }

}
