// import {Login} from 'src/login';
// import {LoginService} from 'src/services/login';
// import {Router} from 'aurelia-router';
// import {ApplicationState} from 'src/services/application-state';
// import {Container, NewInstance} from 'aurelia-framework';

// describe('Login', () => {
//   let container: Container;
//   let login: Login;
//   let loginService: LoginService;
//   let router: Router;
//   let appState: ApplicationState;

//   beforeEach(() => {
//     container = Container.instance;
//     router = container.get(Router);
//     loginService = container.get(LoginService);
//     appState = container.get(ApplicationState);
//     login = container.get(NewInstance.of(Login));
//   });

//   describe('canLogin', () => {
//     it('is false when no username is set', () => {
//       login.loginUser.password = 'testUsername';
//       expect(login.canLogin).toBe(false);
//     });

//     it('is false when no password is set', () => {
//       login.loginUser.username = 'test';
//       expect(login.canLogin).toBe(false);
//     });

//     it('is true when username and password are set', () => {
//       login.loginUser.username = 'test';
//       login.loginUser.password = 'test';
//       expect(login.canLogin).toBe(true);
//     });
//   });

//   describe('login()', () => {
//     beforeEach(() => {
//       spyOn(router, 'navigate');
//     });

//     it('navigates to admin if role is Roles.Admin', (done) => {
//       login.loginUser.username = 'admin';
//       login.login();
//       setTimeout(() => {
//         expect(router.navigate).toHaveBeenCalledWith('admin');
//         done();
//       }, 100);
//     });

//     it('navigates to business if role is Roles.Business', (done) => {
//       login.loginUser.username = 'business';
//       login.login();
//       setTimeout(() => {
//         expect(router.navigate).toHaveBeenCalledWith('business');
//         done();
//       }, 100);
//     });

//     it('adds an error to appState if bad username given', (done) => {
//       login.loginUser.username = 'fake';
//       login.login();
//       setTimeout(() => {
//         expect(appState.errors.length).toBe(1);
//         done();
//       }, 100);
//     });
//   });
// });
