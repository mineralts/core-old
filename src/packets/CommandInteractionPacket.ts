import { Assembler } from '@mineralts/assembler'
import { CommandInteraction } from '@mineralts/api'
import Packet from '../entities/Packet'
import CommandInteractionBuilder from '../builders/CommandInteractionBuilder'

export default class CommandInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const commandContainer = assembler.application.container.commands

    const command = commandContainer.find((command) => (
      command.data.label === payload.data.name
    ))

    const guild = client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new CommandInteractionBuilder(assembler.application.client, member!)
    const interaction: CommandInteraction = interactionBuilder.build(payload)

    await command.run(interaction)

    assembler.eventListener.emit('commandInteraction', interaction)
  }
}