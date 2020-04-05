import { Aurelia, PLATFORM } from 'aurelia-framework';

export function configure(config){
  config.plugin(PLATFORM.moduleName('aurelia-validation'))
}
