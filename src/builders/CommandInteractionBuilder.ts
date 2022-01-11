import { Client, GuildMember, CommandInteraction, InteractionType } from '@mineralts/api'
import { keyFromEnum } from '../utils'

export default class CommandInteractionBuilder {
  constructor (private client: Client, private member: GuildMember) {
  }

  public build (payload: any) {
    return new CommandInteraction(
      payload.id,
      payload.version,
      keyFromEnum(InteractionType, payload.type) as any,
      payload.token,
      undefined,
      undefined,
      undefined,
      this.member,
      payload.data
    )
  }
}