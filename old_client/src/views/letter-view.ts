import { bindable, autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { BriefType, BriefManager } from "models/briefe-model";


@autoinject
export class LetterView{
    public static EDIT_LETTER="edit_letter"
    static bmatch=/([\s\S]+?<body>)([\s\S]+?)(<\/body>[\s\S]+)/
    brief: BriefType
    pre: string
    contents: string
    post: string
    constructor(private ea:EventAggregator, private bm:BriefManager){
        this.ea.subscribe(LetterView.EDIT_LETTER,brief=>{
            this.brief=brief
            const re=LetterView.bmatch.exec(brief.contents)
            this.pre=re[1]
            this.contents=re[2]
            this.post=re[3]
        })
    }

    print(){
        this.brief.contents=this.pre+this.contents+this.post
        this.bm.print(this.brief.contents)
    }

}