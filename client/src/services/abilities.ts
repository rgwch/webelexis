import { AbilityBuilder, Ability } from '@casl/ability'

export class Abilities {

  defineRulesFor(user) {
    console.log("abilities called")
    const { can, rules } = AbilityBuilder.extract()

    can('read', ['Post', 'Comment', 'User'])

    if (user) {
      can('create', 'Post')
      can('manage', ['Post', 'Comment'], { authorId: user._id })
      can(['read', 'update'], 'User', { _id: user._id })
    }

    return rules
  }

  configureAbility({ container }) {
    console.log("Abilities configured")
    const ability = new Ability([])

    container.registerInstance(Ability, ability)
  }


}
