import 'aurelia-polyfills';
import {initialize} from 'aurelia-pal-browser';
import {HttpWrapper} from 'src/services/http-wrapper';
import {DevHttpWrapper} from 'src/services/dev-http-wrapper';
import {Container} from 'aurelia-dependency-injection';

let container = new Container().makeGlobal();
let httpWrapper = container.get(DevHttpWrapper);
container.registerInstance(HttpWrapper, httpWrapper);

initialize();
