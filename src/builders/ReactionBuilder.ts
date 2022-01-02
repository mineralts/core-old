import { Client, Emoji, Reaction, GuildMember } from '@mineralts/api'

export default class ReactionBuilder {
  constructor (private client: Client, private readonly emoji: Emoji, private member: GuildMember) {
  }

  public build () {
    return new Reaction(this.emoji, this.member)
  }
}