import { Guild, Role } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'

export default class RoleDeletePacket extends Packet {
  public packetType = 'GUILD_ROLE_DELETE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)
    const role: Role | undefined = guild?.roles.cache.get(payload.role_id)

    if (!role) {
      return
    }

    assembler.eventListener.emit('roleDelete', role)

    guild?.roles.cache.delete(role.id)
  }
}