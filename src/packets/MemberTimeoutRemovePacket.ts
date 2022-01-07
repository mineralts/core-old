import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'

export default class MemberTimeoutRemovePacket extends Packet {
  public packetType = 'GUILD_MEMBER_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    const guildMember = guild?.members.cache.get(payload.user.id)

    if (!payload.communication_disabled_until) {
      guildMember!.communicationTimeout = null
      assembler.eventListener.emit('memberTimeoutRemove', guildMember)
    }
  }
}