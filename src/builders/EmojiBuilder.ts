import { Client, Emoji, Snowflake, Role } from '@mineralts/api'
import Collection from '@mineralts/api/build/src/utils/Collection'

export default class EmojiBuilder {
  constructor (private client: Client, private roles: Collection<Snowflake, Role>) {
  }

  public build (payload: any) {
    return new Emoji(
      payload.id,
      payload.name,
      payload.managed,
      payload.available,
      payload.animated,
      payload.roles.map((role: any) => this.roles.get(role.id))
    )
  }
}