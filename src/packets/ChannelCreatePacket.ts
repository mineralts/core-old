import { Assembler } from '@mineralts/assembler'
import { MessageManager, TextChannelResolvable } from '@mineralts/api'
import Packet from '../entities/Packet'
import ChannelBuilder from '../builders/ChannelBuilder'

export default class ChannelCreatePacket extends Packet {
  public packetType = 'CHANNEL_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)

    const channelBuilder = new ChannelBuilder(assembler.application.client, assembler.application.logger, guild!)
    const channel = channelBuilder.build(payload)

    guild?.channels.cache.set(channel.id, channel)

    if (channel instanceof TextChannelResolvable) {
      channel.parent = guild?.channels.cache.get(payload.parent_id)
      channel.messages = new MessageManager(channel)
      channel.guild = guild
    }


    assembler.eventListener.emit('channelCreate', channel)
  }
}