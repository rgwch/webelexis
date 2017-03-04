import {Session} from './services/session';
import {Router} from 'aurelia-router';

export class LeftNav {
  public showNav = true;

  private session: Session;
  private router: Router;

  public static inject = [Session, Router];
  constructor(session: Session, router: Router) {
    this.session = session;
    this.router = router;
  }

  public toggleOpen(name) {
    this[name] = !this[name];
  }
}
