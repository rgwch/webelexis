// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/api/hooks.html

export default function (options = {}) { // eslint-disable-line no-unused-vars
  return async context => {
    context.result = context.result.wert
    return context;
  };
};
