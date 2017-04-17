export class User{
  public token:string
  public uid:string
  public displayName: string
  public familyNames: Array<string>
  public givenNames: Array<string>
  public gender: "male"|"female"|"other"
  public email:string
  public roles:Array<string>=[]
  public photos: Array<any>

  constructor(data) {
    Object.assign(this, data);
  }
}
