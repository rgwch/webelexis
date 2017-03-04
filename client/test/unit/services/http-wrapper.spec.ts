import {HttpWrapper} from 'src/services/http-wrapper';
import {Session} from 'src/services/session';
import {HttpClient, HttpResponseMessage, RequestMessage, XHR} from 'aurelia-http-client';
import {Container} from 'aurelia-dependency-injection';
import {User} from 'src/models/user';

describe('HttpWrapper', () => {
  let container;
  let httpClient: HttpClient;
  let session: Session;
  let httpWrapper: HttpWrapper;

  beforeEach(() => {
    container = Container.instance;
    httpClient = container.get(HttpClient);
    session = container.get(Session);
    httpWrapper = container.get(HttpWrapper);
  });

  describe('configure()', () => {
    it('sets the token of the currentUser', (done) => {
      let token = 1000;
      session.currentUser = new User({token: token});
      httpWrapper.configure();
      httpWrapper.get('/mock-api-responses/fake-success.json');
      setTimeout(() => {
        expect(httpWrapper.currentToken).toBe(token)
        done();
      }, 100);
    });
  });

  describe('get', () =>{
    it('loads a patient',(done) =>{
      httpWrapper.get("Patient/detail.json").then(result =>{
        expect(result.resourceType).toBe("Patient")
        done()
      })

    })
  })

});
