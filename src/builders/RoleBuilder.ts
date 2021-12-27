import { Role } from '@mineralts/api'

export default class RoleBuilder {
  public build (payload: any) {
    return new Role(
      payload.id,
      payload.name,
      payload.unicode_emoji,
      payload.position,
      payload.permissions,
      payload.mentionable,
      payload.managed,
      payload.icon,
      payload.hoist,
      payload.color,
      payload.guild,
    )
  }
}