import ReadyPacket from './ReadyPacket'
import Collection from '@mineralts/api/build/src/utils/Collection'
import Packet from '../entities/Packet'
import GuildCreatePacket from './GuildCreatePacket'
import MessageCreatePacket from './MessageCreatePacket'
import ChannelCreatePacket from './ChannelCreatePacket'
import ChannelDeletePacket from './ChannelDeletePacket'
import ChannelUpdatePacket from './ChannelUpdatePacket'
import InviteCreatePacket from './InviteCreatePacket'
import InviteDeletePacket from './InviteDeletePacket'
import MemberJoinPacket from './MemberJoinPacket'
import MessageReactionAdd from './MessageReactionAdd'
import MessageReactionRemove from './MessageReactionRemove'
import MessageDeletePacket from './MessageDeletePacket'
import MessageUpdatePacket from './MessageUpdatePacket'
import MemberLeavePacket from './MemberLeavePacket'
import RoleCreatePacket from './RoleCreatePacket'

export default class PacketManager {
  public packets: Collection<string, Packet[]> = new Collection()

  constructor () {
    this.register(
      new ReadyPacket(),
      new GuildCreatePacket(),
      new MessageCreatePacket(),
      new MessageDeletePacket(),
      new MessageUpdatePacket(),
      new ChannelCreatePacket(),
      new ChannelDeletePacket(),
      new ChannelUpdatePacket(),
      new InviteCreatePacket(),
      new InviteDeletePacket(),
      new MemberJoinPacket(),
      new MemberLeavePacket(),
      new MessageReactionAdd(),
      new MessageReactionRemove(),
      new RoleCreatePacket(),
    )
  }

  public register (...packets: Packet[]) {
    packets.forEach((packet: Packet) => {
      const packetEvent = this.packets.get(packet.packetType)
      if (!packetEvent) {
        this.packets.set(packet.packetType, [packet])
      } else {
        packetEvent.push(packet)
      }
    })
  }

  public resolve (packetType: string) {
    return this.packets.get(packetType)
  }
}