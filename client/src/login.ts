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
   * If we were called by direct navigation, there's probably a token from the server, issued on succesful google-,
   * facebook and so on- login. If so, we check the token for validity and log-in the associated user automatically.
   * @param params 'id' contains possibly a token from a social media login.
   * @param routConfig
   * @param navInstruct
   */
  public activate(params, routConfig, navInstruct){
    let guid=params['id']
    if(guid){
      if(!this.session.getUser()){
        this.loginService.getUser(guid).then(result=>{
          if(result && result.id){
            result.guid=guid
            this.session.login(result)
            this.router.navigate('intro')
          }
        })
      }else if(this.session.getUser().guid === guid){
        this.router.navigate('intro')
      }else{
        this.session.logout()
      }

    }
    // if no user is logged in or no matching guid is given, just display the login page.
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
