import { WebelexisEvents } from './../../webelexisevents';
import v from "./views";
import { StickerManager } from "../../models/stickers.model";
import defaults from "../../user/uidefaults";
import { EventAggregator } from "aurelia-event-aggregator";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import './slide.css'

export enum DISPLAY {
  left, right, both
}
export const SWITCH_PANELS = "switch_panels"

@connectTo(store => store.state.pipe(pluck("panels") as any))
export class Dispatcher {

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

  protected leftpanelstyle
  protected rightpanelstyle
  protected rightExpanded = false;
  protected leftExpanded = false;

  private leftSmall = `left:${defaults.buttonbarwidth}px; width:${defaults.leftpanelwidth}px;`;
  private panelWide = `left:${defaults.buttonbarwidth}px; right:${defaults.buttonbarwidth}px;`;
  private rightSmall = `left:${defaults.buttonbarwidth +
    defaults.leftpanelwidth + 5}px;right:${defaults.buttonbarwidth}px;`;

  private state

  constructor(private ea: EventAggregator, private sm: StickerManager, private we: WebelexisEvents) {
    this.ea.subscribe(SWITCH_PANELS, views => {
      if (views.left) {
        this.leftView = v[views.left];
      }
      if (views.right) {
        this.rightView = v[views.right];
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

  public stateChanged(showNow: DISPLAY, showBefore: DISPLAY) {
    switch (showNow) {
      case DISPLAY.left:
        this.leftpanelstyle = this.panelWide+"width: 80%;"
        this.rightpanelstyle = "display: none;"
        break;
      case DISPLAY.right:
        this.rightpanelstyle = this.panelWide
        this.leftpanelstyle = "display: none"
        break;
      default:
        this.leftpanelstyle = this.leftSmall
        this.rightpanelstyle = this.rightSmall
    }
    /*
    if (showNow) {
      this.rightpanelstyle = "position:absolute;left:440px;right:85px;";
    } else {
      this.rightpanelstyle = "position:absolute;left:5px;right:85px;";
    }
    */
  }

  protected toggleLeft() {
    this.we.togglePanels((this.state === DISPLAY.left) ? DISPLAY.both : DISPLAY.left)
  }

  protected toggleRight() {
    this.we.togglePanels((this.state === DISPLAY.right) ? DISPLAY.both : DISPLAY.right)
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
