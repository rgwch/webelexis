import { IUser } from './user-manager';
import { autoinject, LogManager } from 'aurelia-framework';
import { IKontakt, KontaktManager } from './kontakt-manager';
import { ObjectManager } from './object-manager';
import { UUID, IElexisType, ELEXISDATE, ELEXISDATETIME } from './elexistype';
import { AppState } from '../services/app-state'
import { IQueryResult } from 'services/dataservice';
import { intersection, isInteger } from 'lodash';
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
  private lastUser

  constructor(private km: KontaktManager, private appState: AppState) {
    super('termin')
    if (this.appState.isLoggedIn) {
      this.setUser(this.appState.loggedInUser).then(() => {
        console.log("loaded colors")
      })
    }
    this.appState.subscribe(this.setUser)
  }


  setUser = async (newUser?) => {
    const user = this.appState.loggedInUser
    if (user == this.lastUser) {
      return
    }
    this.lastUser = user
    this.agendaResources = await this.fetch("resources") as []
    this.terminTypColors = await this.dataService.get("typecolors", { query: { user: user.id } })
    this.terminStateColors = await this.dataService.get("statecolors", { query: { user: user.id } })
    this.terminTypes = await this.dataService.get("types") as []
    this.terminStates = await this.fetch("states") as []
  }

  public async find(query?): Promise<IQueryResult<any>> {
    try {
      const found = await super.find(query)
      if (found.data && found.data.length > 0) {
        const ret = []
        const template = found.data[0]
        for (let i = 0; i < found.data.length - 1; i++) {
          const first: IEvent = found.data[i]
          const second: IEvent = found.data[i + 1]
          const firstEnd = parseInt(first.beginn, 10) + parseInt(first.dauer, 10)
          const secondBegin = parseInt(second.beginn, 10)
          ret.push(first)
          if (secondBegin - firstEnd > 1) {
            const gap: Partial<IEvent> = {
              patid: "",
              beginn: firstEnd.toString(),
              bereich: template.bereich,
              dauer: (secondBegin - firstEnd).toString(),
              erstelltvon: first.erstelltvon,
              tag: template.tag,
              terminstatus: this.terminStates[0],
              termintyp: this.terminTypes[0]
            }
            ret.push(gap)
          }
          // ret.push(second)
        }
        ret.push(found.data[found.data.length - 1])
        return {
          data: ret,
          limit: found.limit,
          skip: found.skip,
          total: ret.length
        }
      } else {
        return {
          data: [],
          limit: found.limit,
          skip: found.skip,
          total: 0
        }
      }
    } catch (err) {
      /*
      if (err.code && err.code === 401) {
        this.router.navigateToRoute("user")
      } else */{
        log.error(err)
      }
    }
  }

  getLabel(ev: IEvent) {
    if (ev.kontakt) {
      return this.km.getLabel(ev.kontakt)
    }
    if (ev.termintyp === this.terminTypes[0]) {
      return ""
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
