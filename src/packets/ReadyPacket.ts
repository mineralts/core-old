import { Assembler } from '@mineralts/assembler'
import { Client, User, Collection } from '@mineralts/api'
import { DateTime } from 'luxon'
import Packet from '../entities/Packet'

export default class ReadyPacket extends Packet {
  public packetType = 'READY'

  public async handle (assembler: Assembler, payload: any) {
    const user = new User(
      payload.user.id,
      payload.user.username,
      payload.user.discriminator,
      `${payload.user.username}#${payload.user.discriminator}`,
      payload.user.bot,
      DateTime.fromISO(payload.user.premium_since),
      payload.user.verified,
      payload.user.mfa_enabled,
      payload.user.flags,
      payload.user.email,
      payload.user.avatar,
      payload.user.banner,
      undefined
    )

    const client = new Client(
      assembler.application.container,
      assembler.application.token,
      {},
      user,
      payload.session_id,
      payload.presences,
      payload.application,
      new Collection()
    )

    assembler.application.client = client

    await assembler.register()
    await client.registerGlobalCommands(assembler)

    assembler.eventListener.emit('ready', client)
  }
}