import Packet from '../entities/Packet'
import { Assembler } from '@mineralts/assembler'
import { TextChannel, Emoji, GuildMember, Reaction } from '@mineralts/api'
import EmojiBuilder from '../builders/EmojiBuilder'
import ReactionBuilder from '../builders/ReactionBuilder'

export default class MessageReactionAdd extends Packet {
  public packetType = 'MESSAGE_REACTION_ADD'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client

    const guild = client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.message_id)

    if (message) {

      console.log(payload)
      const member: GuildMember | undefined = guild?.members.cache.get(payload.user_id)

      const emojiBuilder: EmojiBuilder = new EmojiBuilder()
      const emoji: Emoji = emojiBuilder.build(payload.emoji)

      const reactionBuilder: ReactionBuilder = new ReactionBuilder(client, emoji, member!)
      const reaction: Reaction = reactionBuilder.build()

      message.reactions.addReaction(emoji, member!)

      assembler.eventListener.emit('messageReactionAdd', message, reaction)
    }
  }
}