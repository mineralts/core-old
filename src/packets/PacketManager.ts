import ReadyPacket from './ReadyPacket'
import Collection from '../utils/Collection'
import Packet from '../entities/Packet'

export default class PacketManager {
  public packets: Collection<string, Packet[]> = new Collection()

  constructor () {
    this.register(
      new ReadyPacket(),
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