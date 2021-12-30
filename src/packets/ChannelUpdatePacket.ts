import { Assembler } from '@mineralts/assembler'
import { MessageManager, TextChannelResolvable } from '@mineralts/api'
import Packet from '../entities/Packet'
import ChannelBuilder from '../builders/ChannelBuilder'

export default class ChannelUpdatePacket extends Packet {
  public packetType = 'CHANNEL_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const before = guild?.channels.cache.get(payload.id)

    const channelBuilder = new ChannelBuilder(assembler.application.client, assembler.application.logger, guild!)
    const after = channelBuilder.build(payload)

    if (after instanceof TextChannelResolvable) {
      after.parent = guild?.channels.cache.get(payload.parent_id)
      after.messages = new MessageManager(after)
      after.guild = guild
    }

    assembler.eventListener.emit('channelUpdate', before!, after)

    guild?.channels.cache.set(after.id, after)
  }
}