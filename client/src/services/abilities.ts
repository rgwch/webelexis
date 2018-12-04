import { AbilityBuilder, Ability } from '@casl/ability'

export class Abilities {

  defineRulesFor(user) {
    const { can, rules } = AbilityBuilder.extract()

    can('read', ['Post', 'Comment'])

    if (user) {
      can('create', 'Post')
      can('manage', ['Post', 'Comment'], { authorId: user._id })
      can(['read', 'update'], 'User', { _id: user._id })
    }

    return rules
  }

  configureAbility({ container }) {
    const ability = new Ability([])

    container.registerInstance(Ability, ability)
  }


}
