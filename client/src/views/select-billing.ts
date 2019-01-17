import { autoinject, observable} from "aurelia-framework";
import { EncounterType } from "models/encounter-model";
import { LeistungsblockManager } from "models/leistungsblock-model";
import { DataService, DataSource } from "./../services/datasource";
import { WebelexisEvents } from "./../webelexisevents";

@autoinject
export class SelectBilling {
  @observable
  protected ls_position: string;
  protected billables = [];
  protected blocks = [];

  private billableService: DataService;
  private blockService: DataService;
  private encounter: EncounterType;
  private selected = [];

  constructor(
    private ds: DataSource,
    private we: WebelexisEvents,
    private bm: LeistungsblockManager
  ) {
    this.billableService = ds.getService("billable");
    this.blockService = ds.getService("leistungsblock");
  }

  public activate(kons) {
    this.blockService.find().then(result => {
      this.blocks = result.data.map(d => {
        d.openState = false;
        return d;
      });
    });
  }

  public ls_positionChanged(newValue, oldValue) {
    this.encounter = this.we.getSelectedItem("konsultation");
    if (!this.encounter) {
      alert(
        "Damit die richtigen Positionen angezeigt werden, bitte eine Konsultation zum Verrechnen öffnen"
      );
    } else {
      this.billables = [];
      this.billableService
        .find({ query: { find: this.ls_position, encounter: this.encounter } })
        .then(result => {
          this.billables = result;
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  public drag(event) {
    // console.log(event)
    event.dataTransfer.setData("text", event.target.id);
    return true;
  }

  protected select(item) {
    this.selected.push(item);
  }
  protected deselect(item) {
    const idx = this.selected.indexOf(item);
    this.selected.splice(idx, 1);
  }
  protected getCode = elem => elem.code || elem.id.split(/-/)[0];
  protected getText = elem => elem.tx255 || elem.DSCR;
  protected getLabel = block => block.name || "??";
  protected makeLabel(elem) {
    return this.getCode(elem) + " " + this.getText(elem);
  }

  protected changeState(block) {
    // console.log(block.name)
    if (block.openState) {
      block.openState = false;
    } else {
      this.bm.getElements(block).then(elements => {
        block.resolved = elements;
        block.openState = true;
      });
    }
  }
}
