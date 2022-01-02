import { Guild, Role } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import RoleBuilder from '../builders/RoleBuilder'

export default class RoleUpdatePacket extends Packet {
  public packetType = 'GUILD_ROLE_UPDATE'

  public async handle (assembler: Assembler, payload: any) {
    const guild: Guild | undefined = assembler.application.client.guilds.cache.get(payload.guild_id)
    const before: Role | undefined = guild?.roles.cache.get(payload.role.id)

    const roleBuilder: RoleBuilder = new RoleBuilder()
    const after: Role = roleBuilder.build(payload.role)

    assembler.eventListener.emit('roleUpdate', before, after)

    guild?.roles.cache.set(after.id, after)
  }
}