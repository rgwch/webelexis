import {FindingType} from '../../models/finding'
import { bindable } from 'aurelia-framework';

export class Finding{
  @bindable obj: FindingType
}
