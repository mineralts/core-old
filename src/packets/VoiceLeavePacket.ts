import { GuildMember, Guild, Client } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'

export default class VoiceLeavePacket extends Packet {
  public packetType = 'VOICE_STATE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const client: Client = assembler.application.client
    const guild: Guild | undefined = client.guilds.cache.get(payload.guild_id)
    const before: GuildMember | undefined = guild?.members.cache.get(payload.member.user.id)

    if (!before?.voice.channel || before.voice.channel.id === payload.channel_id) {
      return
    }

    const after = guild?.members.cache.get(payload.member.user.id)

    assembler.eventListener.emit('voiceLeave', after!)
  }
}