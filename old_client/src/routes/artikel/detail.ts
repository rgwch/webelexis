import { inlineView } from "aurelia-framework";

@inlineView(`
  <template>
  <require from="views/artikeldetail"></require>
  <div class="row" id="article_details">
    <artikel-detail></artikel-detail>
  </div>
  </template>
`)
export class Detail{

}
