import {
  Client,
  GuildMember,
  Role,
  Snowflake,
  GuildMemberRoleManager,
  Guild,
  VoiceState,
} from '@mineralts/api'
import { UserBuilder } from './UserBuilder'
import { DateTime } from 'luxon'
import Collection from '@mineralts/api/build/src/utils/Collection'

export default class GuildMemberBuilder {
  constructor (private client: Client, private readonly roles: Collection<Snowflake, Role>, private guild: Guild) {
  }

  public build (payload: any) {
    const user = new UserBuilder(this.client, payload.user).build()
    const guildMember = new GuildMember(
      payload.user.id,
      payload.nick || user.username,
      user,
      undefined as any,
      new GuildMemberRoleManager(),
      payload.highest_role
        ? this.roles.get(payload.highest_role)!
        : null,
      payload.is_pending,
      undefined as any,
      DateTime.fromISO(payload.joined_at),
    )

    guildMember.voice = new VoiceState(
      guildMember,
      undefined as any,
      undefined as any,
      undefined as any,
      payload.mute,
      payload.deaf,
      undefined as any,
      undefined as any,
      this.guild,
    )

    return guildMember
  }
}