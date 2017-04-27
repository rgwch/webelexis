/*********************************
 * This file is part of Webelexis
 * Copyright (c) 2017 by G. Weirich
 **********************************/

/**
 * publicly visible aspect of a user
 */
export class PublicUser {
  public id: string = ''
  public sid: string = '';
  public displayName: string = '';
  public roles: Array<string> = []
  public familyNames: Array<string> = [];
  public givenNames: Array<String> = [];
  public gender: " male" | "female" | "other"
  public dateOfBirth = '';
  public emails:Array<string> = [];
  public photos: Array<any>
  public phone = '';

  constructor(data) {
    Object.assign(this, data);
  }
}




