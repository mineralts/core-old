import { TextChannel } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import MessageBuilder from '../builders/MessageBuilder'

export default class MessageUpdatePacket extends Packet {
  public packetType = 'MESSAGE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const before = channel.messages.cache.get(payload.id)

    const messageBuilder = new MessageBuilder(assembler.application.client)
    const after = messageBuilder.build(payload)


    assembler.eventListener.emit('messageUpdate', before || undefined, after)

    channel.messages.cache.set(after.id, after)
  }
}