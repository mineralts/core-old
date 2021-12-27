import { Assembler } from '@mineralts/assembler'
import { Client, User } from '@mineralts/api'
import { DateTime } from 'luxon'
import Packet from '../entities/Packet'
import Collection from '@mineralts/api/build/src/utils/Collection'

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

    assembler.eventListener.emit('ready', client)
  }
}