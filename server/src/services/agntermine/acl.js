const roles = require('../roles')
const {Ability, AbilityBuilder} = require('@casl/ability')

module.exports={
  [roles.admin]: new Ability([{subject:'all',actions:'manage'}]),
  [roles.user]: new Ability([
    {subject: 'all', actions: ['create','update','delete','find']}
  ])
}
