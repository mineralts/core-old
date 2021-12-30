import { Invite } from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import GuildMemberBuilder from '../builders/GuildMemberBuilder'

export default class MemberJoinPacket extends Packet {
  public packetType = 'GUILD_MEMBER_ADD'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const guild = client.guilds.cache.get(payload.guild_id)

    const guildMemberBuilder = new GuildMemberBuilder(client, guild?.roles, guild!)
    const guildMember = guildMemberBuilder.build(payload)

    if (guildMember.user.isBot) {
      guild?.bots.cache.set(guildMember.id, guildMember)
    } else {
      guild?.members.cache.set(guildMember.id, guildMember)
    }

    const request = await assembler.connector.http.get(`/guilds/${guild!.id}/invites`) as any[]

    const invite = request.map((item) => {
      return guild?.invites.cache.find((invite: Invite) => invite.count < item.uses)
    }).shift() as Invite

    invite.count++

    assembler.eventListener.emit('guildMemberJoin', guildMember, invite)
  }
}