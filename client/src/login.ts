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

  public canActivate(params, routConfig, navInstruct){
    let id=params['id']
    if(id){
      if(!this.session.currentUser){
        this.loginService.getUser(id).then(result=>{
          if(result.uid){
            this.session.currentUser=result
            this.router.navigate('intro')
          }
        })
      }else{
        this.router.navigate('intro')
      }

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
      this.session.setCurrentUser(loggedInUser);
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
