import { TextChannel } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'

export default class MessageDeletePacket extends Packet {
  public packetType = 'MESSAGE_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const channel = guild?.channels.cache.get(payload.channel_id) as TextChannel
    const message = channel.messages.cache.get(payload.id)

    assembler.eventListener.emit('messageDelete', message)

    channel.messages.cache.delete(payload.id)
  }
}