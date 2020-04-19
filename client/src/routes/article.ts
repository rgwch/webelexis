import { ArticleManager } from './../models/article-manager';
import { bindable } from 'aurelia-framework';
import { IViewerConfiguration } from './../forms/commonviewer';

export class Article{
  @bindable cfg: IViewerConfiguration={
    dataType: 'article',
    title: "",
    searchFields:[
      {
        asPrefix: true,
        name: "dscr",
        label: "Name",
        value: ""
      }
    ],
    selectMsg: "artSelected",
    getLabel: obj=>this.am.getLabel(obj)
  }

  constructor(private am:ArticleManager){
    
  }
}
