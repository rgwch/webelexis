import {Session} from '../services/session';
import {Router} from 'aurelia-router';

export class UserDropdown {
  public links: Array<any>;
  private session: Session;
  private router: Router;

  private static inject = [Session, Router];

  constructor(session: Session, router: Router) {
    this.session = session;
    this.router = router;
    this.links = [
      {label: 'Log out', action: this.logout},
      {label: 'Profile', roleId: 1, action: this.gotoProfile},
      {label: 'Admin', roleId: 2, action: this.gotoAdmin}
    ];
  }

  public doAction(link) {
    link.action.call(this);
  }

  public logout() {
    this.session.logout();
    this.router.navigate('login');
  }

  public gotoAdmin() {
    console.log('TODO: Goto Admin');
  }

  public gotoProfile() {
    console.log('TODO: Goto Profile');
  }
}
