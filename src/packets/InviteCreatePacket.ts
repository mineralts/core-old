import { Assembler } from '@mineralts/assembler'
import { Invite } from '@mineralts/api'
import Packet from '../entities/Packet'
import { DateTime } from 'luxon'

export default class InviteCreatePacket extends Packet {
  public packetType = 'INVITE_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild = assembler.application.client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.inviter.id)
    const channel = guild?.channels.cache.get(payload.channel_id)

    const invite = new Invite(
      member!,
      channel!,
      payload.code,
      payload.uses,
      payload.max_uses,
      payload.temporary,
      DateTime.fromISO(payload.expires_at),
      DateTime.fromISO(payload.created_at)
    )

    guild?.invites.cache.set(payload.code, invite)

    assembler.eventListener.emit('inviteCreate', invite)
  }
}