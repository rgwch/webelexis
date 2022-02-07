// A hook that logs service method before, after and error
// See https://github.com/winstonjs/winston for documentation
// about the logger.
import { logger } from '../logger'

// To see more detailed messages, uncomment the following line
// logger.level = 'debug';

export default function () {
  return context => {
    // This debugs the service call and a stringified version of the hook context
    // You can customize the mssage (and logger) to your needs
    // logger.debug(`${context.type} app.service('${context.path}').${context.method}()`);

    /* This slows down things EXTREMELY if context is large
    if(typeof context.toJSON === 'function') {
      logger.debug('Hook Context', JSON.stringify(context, null, '  '));
    }
    */

    if (context.error) {
      //logger.error(context.error); // this leads to huge log messages
    }
  };
};
