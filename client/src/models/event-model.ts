import { IUser } from './user-model';
import { autoinject, LogManager } from 'aurelia-framework';
import { IKontakt, KontaktManager } from './kontakt-model';
import { ObjectManager } from './object-manager';
import { UUID, IElexisType, ELEXISDATE, ELEXISDATETIME } from './elexistype';
import { AppState } from '../services/app-state'
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
  private actUser: IUser

  constructor(private km: KontaktManager, private appState: AppState) {
    super('termin')
    if (this.appState.isLoggedIn) {
      this.setUser(this.appState.loggedInUser).then(() => {
        console.log("loaded colors")
      })
    }
    this.appState.subscribe(this.setUser)
  }


  public async setUser(user?: IUser) {
    if (this.actUser && user && this.actUser.id === user.id) {
      return
    }
    this.actUser = user || this.actUser
    this.agendaResources = await this.fetch("resources") as []
    this.terminTypColors = await this.dataService.get("typecolors", { query: { user: this.actUser.id } })
    this.terminStateColors = await this.dataService.get("statecolors", { query: { user: this.actUser.id } })
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

  getTypeColor(ev: IEvent): string {
    return "#" + this.terminTypColors[ev.termintyp]
  }

  getStateColor(ev: IEvent): string {
    return "#" + this.terminStateColors[ev.terminstatus]
  }

  getNextEvent(ev: IEvent): Promise<IEvent> {
    return null
  }
}
