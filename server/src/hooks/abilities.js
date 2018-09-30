const {Ability, AbilityBuilder, ForbiddenError} = require('@casl/ability')

const defineAbilitiesFor=(user)=>{
  return AbilityBuilder.define((can,cannot)=>{

  })
}

// eslint-disable-next-line no-unused-vars
module.exports = function (options = {}) {
  Ability.addAlias('update','patch')
  Ability.addAlias('read',['get','find'])
  Ability.addAlias('remove','delete')
  return async context => {
    if(context.app.get("testing")==true){
      return context
    }
    const needed=context.service.abilities
    if(!context.params.user){
      throw new ForbiddenError("No user")
    }
    for(const role of context.params.user.roles){
      if(needed[role] && needed[role].can(context.method)){
        return context
      }
    }
    throw new ForbiddenError("Unauthorized");
  };
};
