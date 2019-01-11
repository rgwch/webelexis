import v from "./views";
import { StickerManager } from "../../models/stickers.model";
import defaults from "../../user/uidefaults";
import { EventAggregator } from "aurelia-event-aggregator";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";

@connectTo(store => store.state.pipe(pluck("leftPanel") as any))
export class Dispatcher {
  public static message = "switch_panels";
  protected rightpanels: Element;

  protected leftViews = [
    v.patientenliste,
    v.artikelliste,
    v.dokumentliste,
    v.briefe,
    v.messwerte,
    v.leistungen
  ];
  protected leftView = v.patientenliste;
  protected rightViews = [
    v.stammdaten,
    v.konsultationen,
    v.dokumente,
    v.artikeldetail,
    v.labor,
    v.agendagross,
    v.medikation
  ];
  protected rightView = v.stammdaten;
  protected tooliconwidth = defaults.tooliconwidth;
  protected tooliconheight = defaults.tooliconheight;

  protected leftpanelstyle = `position:absolute;left:${
    defaults.buttonbarwidth
  }px; width:${defaults.leftpanelwidth}px;`;
  protected rightpanelstyle = `position:absolute;left:${defaults.buttonbarwidth +
    defaults.leftpanelwidth}px;right:${defaults.buttonbarwidth}px;`;

  protected rightExpanded = false;
  protected leftExpanded = false;

  constructor(private ea: EventAggregator, private sm: StickerManager) {
    this.ea.subscribe(Dispatcher.message, views => {
      if (views.left) {
        this.leftView = views.left;
      }
      if (views.right) {
        this.rightView = views.right;
      }
    });
  }

  public activate(params /*, routeConfig */) {
    if (params && params.sub) {
      const actview = this.rightViews.find(
        vv => vv.text.toLowerCase() === params.sub
      );
      this.rightView = actview;
    } else {
      this.rightView = v.stammdaten;
    }
  }

  public stateChanged(showNow, showBefore) {
    if (showNow) {
      this.rightpanelstyle = "position:absolute;left:440px;right:85px;";
    } else {
      this.rightpanelstyle = "position:absolute;left:5px;right:85px;";
    }
  }
  public expand(mode) {
    this.rightExpanded = mode;
  }

  protected switchLeft(view) {
    this.leftView = view;
  }

  protected switchRight(view) {
    this.rightView = view;
  }

  protected calcwidth() {
    const w =
      this.rightpanels.getBoundingClientRect().width - this.tooliconwidth;
    const st = `width:${w}px`;
    return st;
  }
}
