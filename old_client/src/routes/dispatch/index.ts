/********************************************
 * This file is part of Webelexis           *
 * Copyright (c) 2016-2020 by G. Weirich    *
 * License and Terms see LICENSE            *
 ********************************************/

import { WebelexisEvents } from "../../webelexisevents";
import v from "./views";
import { StickerManager } from "../../models/stickers.model";
import defaults from "../../user/uidefaults";
import { EventAggregator } from "aurelia-event-aggregator";
import { connectTo } from "aurelia-store";
import { pluck } from "rxjs/operators";
import "./slide.css";

export enum DISPLAY {
  left,
  right,
  both
}
export const SWITCH_PANELS = "switch_panels";

/**
 * Main screen of the application. The view features two slots to insert views according to the
 * current program state. Display is managed with two controls:
 * - An EventAggregator-Message SWITCH_PANELS controls, which display to show on the left and
 * on the right.
 * - The Webelexis-State "panels" controls, if the left, the right or both panels are to show.
 */
@connectTo(store => store.state.pipe(pluck("panels") as any))
export class Dispatcher {
  protected rightpanels: Element;

  /* predefined views for the left panel */
  protected leftViews = [
    v.patientenliste,
    v.artikelliste,
    v.dokumentliste,
    v.briefe,
    v.messwerte,
    v.leistungen,
    v.tagesliste,
    v.auf
  ];
  // currently set left panel
  protected leftView = v.patientenliste;

  /* predefined views for the right panel */
  protected rightViews = [
    v.stammdaten,
    v.konsultationen,
    v.dokumente,
    v.brief,
    v.artikeldetail,
    v.labor,
    v.agendagross,
    v.medikation
  ];
  // currentli set right panel
  protected rightView = v.stammdaten;

  // size of the menu buttons.
  protected tooliconwidth = defaults.tooliconwidth;
  protected tooliconheight = defaults.tooliconheight;

  // currently applied style for the panels
  protected leftpanelstyle: string;
  protected rightpanelstyle: string;

  /* predefined styles for severel display conditions */
  private leftSmall = `left:${defaults.buttonbarwidth}px; width:${
    defaults.leftpanelwidth
  }px;`;
  private panelWide = `left:${defaults.buttonbarwidth}px; right:${
    defaults.buttonbarwidth
  }px;`;
  private rightSmall = `left:${defaults.buttonbarwidth +
    defaults.leftpanelwidth +
    5}px;right:${defaults.buttonbarwidth}px;`;

  private state;

  constructor(
    private ea: EventAggregator,
    private sm: StickerManager,
    private we: WebelexisEvents
  ) {
    this.ea.subscribe(SWITCH_PANELS, views => {
      if (views.left) {
        this.leftView = v[views.left];
      }
      if (views.right) {
        this.rightView = v[views.right];
      }
    });
  }

  public attached() {
    return this.sm.loadStickers().then(st => {
      // console.log(st)
    });
  }
  /**
   * if the route is activated with a parameter (e.g. /#/dispatch/artikel),
   * then that view is mounted on the right panel. Otherwise, v.stammdaten
   * is set.
   * @param params supplied by the framework
   */
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

  /**
   * WebelexisEvent to change display mode
   * @param showNow new mode
   * @param showBefore previous mode (can be undefined)
   */
  public stateChanged(showNow: DISPLAY, showBefore: DISPLAY) {
    switch (showNow) {
      case DISPLAY.left:
        this.leftpanelstyle = this.panelWide + "width: 80%;";
        this.rightpanelstyle = "display: none;";
        break;
      case DISPLAY.right:
        this.rightpanelstyle = this.panelWide;
        this.leftpanelstyle = "display: none";
        break;
      default:
        this.leftpanelstyle = this.leftSmall;
        this.rightpanelstyle = this.rightSmall;
    }
  }

  /**
   * enlarge or shrink the left panel (click action)
   */
  protected toggleLeft() {
    this.we.togglePanels(
      this.state === DISPLAY.left ? DISPLAY.both : DISPLAY.left
    );
  }

  /**
   * enlarge or shrink the right panel (click action)
   */
  protected toggleRight() {
    this.we.togglePanels(
      this.state === DISPLAY.right ? DISPLAY.both : DISPLAY.right
    );
  }
  /**
   * set the left view (menu click action)
   * @param view 
   */
  protected switchLeft(view) {
    this.leftView = view;
  }

  /**
   * set the right view (menu click action)
   * @param view
   */
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
