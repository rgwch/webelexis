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

  /**
   * We arrive here either by direct navigation to /login or redirected from the Router's authorize step (see app.ts).
   * If there's already a valid user, we go directly to 'intro' and skip login.
   * Note: no need for extensive security checks, since user permissions are checked on the server side anyway.
   *
   */
  public activate(params, routConfig, navInstruct){
    if(this.session.getUser()){
      this.router.navigate(('intro'))
    }
   }

  private static inject = [Router, LoginService, Session];
  constructor(router: Router, loginService: LoginService, session: Session) {
    this.router = router;
    this.loginService = loginService;
    this.session = session;
  }
  public login() {
    this.loginService.login(this.email,this.password).then(loggedInUser => {
      this.session.login(loggedInUser);
      if (loggedInUser) {
        this.router.navigate('intro');
      }
    });
  }


  public google(){
    this.loginService.googleSignIn()
  }

  private address(suffix:string){
    return this.loginService.formattedURL(suffix)
  }
}
