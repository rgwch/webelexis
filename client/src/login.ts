import {Router} from 'aurelia-router';
import {LoginService} from './services/login';
import {Session} from './services/session';
import {computedFrom} from 'aurelia-framework';

export class Login {

  private router: Router;
  private loginService: LoginService;
  private session: Session;
  private email:string=""
  private password:string=""

  @computedFrom('email', 'password')
  public get canLogin () {
    let result = this.email.length>0 && this.password.length>0;
    return result;
  }

  private static inject = [Router, LoginService, Session];
  constructor(router: Router, loginService: LoginService, session: Session) {
    this.router = router;
    this.loginService = loginService;
    this.session = session;
  }
  public login() {
    this.loginService.login(this.email,this.password).then(loggedInUser => {
      this.session.setCurrentUser(loggedInUser);
      if (loggedInUser) {
        this.router.navigate('patients');
      }
    });
  }
}
