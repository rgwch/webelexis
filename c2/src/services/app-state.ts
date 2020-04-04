import { autoinject } from 'aurelia-framework';

import { FeathersDS } from './feathers-api';
import { IUser } from './../models/user-model';

@autoinject
export class AppState{

  public loggedInUser:IUser
}
