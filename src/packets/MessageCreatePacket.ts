import { TextChannel } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import MessageBuilder from '../builders/MessageBuilder'

export default class MessageCreatePacket extends Packet {
  public packetType = 'MESSAGE_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    if (!payload.guild_id) {
      return
    }

    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel

    const messageBuilder = new MessageBuilder(assembler.application.client)
    const message = messageBuilder.build(payload)

    if (channel) {
      channel.lastMessageId = message.id
      channel.lastMessage = message
      channel.messages.cache.set(message.id, message)
    }

    assembler.eventListener.emit('messageCreate', message)
  }
}