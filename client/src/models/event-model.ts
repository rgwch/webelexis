import { IUser } from './user-model';
import { autoinject, LogManager } from 'aurelia-framework';
import { IKontakt, KontaktManager } from './kontakt-model';
import { ObjectManager } from './object-manager';
import { UUID, IElexisType, ELEXISDATE, ELEXISDATETIME } from './elexistype';
import { connectTo } from 'aurelia-store'
import { AppState } from '../services/app-state'
import { pluck } from 'rxjs/operators'
const log = LogManager.getLogger('EventManager')


export interface IEvent extends IElexisType {
  patid: UUID
  bereich: string
  tag: ELEXISDATE
  beginn: string
  dauer: string
  grund: string
  termintyp: string
  terminstatus: string
  erstelltvon: UUID
  angelegt: ELEXISDATETIME
  lastedit: ELEXISDATETIME
  casetype: string
  insurancetype: string
  treatmentreason: string
  kontakt?: IKontakt
}


// @connectTo<State>(store => store.state.pipe(pluck('loggedInUser')))
// @connectTo()
@autoinject
export class EventManager extends ObjectManager {
  public terminTypes: string[] = []
  public terminStates: string[] = []
  public terminTypColors = {}
  public terminStateColors = {}
  public agendaResources = []

  constructor(private km: KontaktManager) {
    super('termin')
  }
  
  stateChanged(newUser, oldUser) {
    if (newUser) {
      this.setUser(newUser).then(() => {
        log.info("Changed user to " + newUser.id)
      })
    }
  }
  public async setUser(user: IUser) {
    this.agendaResources = await this.fetch("resources") as []
    this.terminTypColors = await this.dataService.get("typecolors", { query: { user: user.id } })
    this.terminStateColors = await this.dataService.get("statecolors", { query: { user: user.id } })
    this.terminTypes = await this.dataService.get("types") as []
    this.terminStates = await this.fetch("states") as []
  }

  getLabel(ev: IEvent) {
    if (ev.kontakt) {
      return this.km.getLabel(ev.kontakt)
    }
    if (ev.patid) {
      return ev.patid
    } else {
      return "Reserviert"
    }
  }

  getTypeColor(ev:IEvent): string{
    return "#"+this.terminTypColors[ev.termintyp]
  }

  getStateColor(ev:IEvent): string{
    return "#"+this.terminStateColors[ev.terminstatus]
  }

  getNextEvent(ev:IEvent): Promise<IEvent> {
    return null
  }
}
