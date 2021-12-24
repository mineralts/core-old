import { Assembler } from '@mineralts/assembler'

export default abstract class Packet {
  public packetType!: string
  public abstract handle (assembler: Assembler, payload: any): Promise<void>
}