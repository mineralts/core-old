import ReadyPacket from './ReadyPacket'
import Collection from '@mineralts/api/build/src/utils/Collection'
import Packet from '../entities/Packet'
import GuildCreatePacket from './GuildCreatePacket'
import MessageCreatePacket from './MessageCreatePacket'

export default class PacketManager {
  public packets: Collection<string, Packet[]> = new Collection()

  constructor () {
    this.register(
      new ReadyPacket(),
      new GuildCreatePacket(),
      new MessageCreatePacket()
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