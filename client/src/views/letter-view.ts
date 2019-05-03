import { bindable, autoinject } from "aurelia-framework";
import { EventAggregator } from "aurelia-event-aggregator";
import { BriefType, BriefManager } from "models/briefe-model";


@autoinject
export class LetterView{
    public static EDIT_LETTER="edit_letter"
    brief: BriefType
    constructor(private ea:EventAggregator, private bm:BriefManager){
        this.ea.subscribe(LetterView.EDIT_LETTER,brief=>{
            this.brief=brief
        })
    }

    print(){
        this.bm.print(this.brief.contents)
    }

}