import {Session} from '../../services/session';

export class Index {
  public session: Session;
  private static inject = [Session];
  constructor(session: Session) {
    this.session = session;
  }
}
