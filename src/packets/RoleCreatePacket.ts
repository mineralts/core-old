import { Role, Guild } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import RoleBuilder from '../builders/RoleBuilder'

export default class RoleCreatePacket extends Packet {
  public packetType = 'GUILD_ROLE_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)

    const roleBuilder: RoleBuilder = new RoleBuilder()
    const role: Role = roleBuilder.build(payload.role)

    guild?.roles.cache.set(role.id, role)

    assembler.eventListener.emit('roleCreate', role)
  }
}