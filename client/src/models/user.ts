export class User {
  public username = '';
  public roles: Array<string>=[]
  public firstName = '';
  public lastName = '';
  public dateOfBirth = '';
  public email = '';
  public phone = '';
  public guid = '';
  public id=''

  constructor(data) {
    Object.assign(this, data);
  }
}


