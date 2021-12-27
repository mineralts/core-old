import { Collection } from '@mineralts/api'
import {
  CategoryChannel,
  ChannelResolvable,
  Emoji,
  Guild,
  GuildMember,
  Presence,
  Role,
  Snowflake,
  GuildChannelManager,
} from '@mineralts/api'
import { Assembler } from '@mineralts/assembler'
import Packet from '../entities/Packet'
import GuildBuilder from '../builders/GuildBuilder'
import GuildMemberBuilder from '../builders/GuildMemberBuilder'
import RoleBuilder from '../builders/RoleBuilder'
import EmojiBuilder from '../builders/EmojiBuilder'
import PresenceBuilder from '../builders/PresenceBuilder'
import ChannelBuilder from '../builders/ChannelBuilder'
import InviteBuilder from '../builders/InviteBuilder'

export default class GuildCreatePacket extends Packet {
  public packetType = 'GUILD_CREATE'

  private guildMembers: Collection<Snowflake, GuildMember> = new Collection()
  private guildBots: Collection<Snowflake, GuildMember> = new Collection()

  private presences: Collection<Snowflake, Presence> = new Collection()
  private roles: Collection<Snowflake, Role> = new Collection()
  private emojis: Collection<Snowflake, Emoji> = new Collection()
  private channels: Collection<Snowflake, ChannelResolvable> = new Collection()
  private guild!: Guild

  public async handle (assembler: Assembler, payload: any) {

    const roleBuilder = new RoleBuilder(assembler.application.client)
    payload.roles.forEach((item: any) => {
      const role = roleBuilder.build(item)
      this.roles.set(role.id, role)
    })

    const guild = new GuildBuilder(assembler.application.client, payload)
    this.guild = guild.build(this.guildMembers)

    const guildMemberBuilder = new GuildMemberBuilder(assembler.application.client, this.roles, this.guild)
    payload.members.forEach((item: any) => {
      const guildMember = guildMemberBuilder.build(item)

      if (guildMember.user.isBot) {
        this.guildBots.set(guildMember.user.id, guildMember)
      } else {
        this.guildMembers.set(guildMember.user.id, guildMember)
      }
    })

    const emojiBuilder = new EmojiBuilder(assembler.application.client, this.roles)
    payload.emojis.forEach((item: any) => {
      const emoji = emojiBuilder.build(item)
      this.emojis.set(emoji.id, emoji)
    })

    const presenceBuilder = new PresenceBuilder(assembler.application.client, this.guildMembers.concat(this.guildBots))
    payload.presences.forEach((item: any) => {
      const presence = presenceBuilder.build(item)
      this.presences.set(presence.member.user.id, presence)
    })

    const channelBuilder = new ChannelBuilder(assembler.application.client, assembler.application.logger, this.guild)
    payload.channels.forEach((item: any) => {
      const channel = channelBuilder.build(item)

      if (!(channel instanceof CategoryChannel)) {
        channel.parent = this.channels.get(channel.parentId!) as CategoryChannel
      }

      this.channels.set(
        channel ? channel.id : item.id,
        channel
      )
    })

    this.guildMembers.forEach((member: GuildMember) => {
      member.guild = this.guild
      member.user.presence = this.presences.get(member.user.id)
    })

    this.guildBots.forEach((member: GuildMember) => {
      member.guild = this.guild
      member.user.presence = this.presences.get(member.user.id)
    })

    this.guild.owner = this.guildMembers.get(payload.owner_id)
    this.guild.members.register(this.guildMembers)
    this.guild.bots.register(this.guildBots)
    this.guild.channels = new GuildChannelManager(this.guild).register(this.channels)
    this.guild.emojis.register(this.emojis)
    this.guild.roles.register(this.roles)

    const invites = await assembler.connector.http.get(`/guilds/${this.guild.id}/invites`)

    const inviteBuilder = new InviteBuilder(assembler.application.client, this.guild)
    invites.forEach((item) => {
      const invite = inviteBuilder.build(item)
      this.guild.invites.cache.set(invite.code, invite)
    })

    console.log(this.guild.bots)
    assembler.application.client.guilds.cache.set(this.guild.id, this.guild)

    assembler.eventListener.emit('guildCreate', this.guild)
  }
}