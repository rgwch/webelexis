const uuid = require('uuid/v4')
// eslint-disable-next-line no-unused-vars

/**
 * make sure every newly created object has a correct id and lastupdate/deleetd fields
 * @param {} options
 */
module.exports = function (options = {}) {
  return async context => {
    if(context.data){
      if(!context.data.id){
        context.data.id=uuid()
      }
      context.data.lastupdate=new Date().getTime();
      context.data.deleted="0";
    }
    return context;
  };
};
