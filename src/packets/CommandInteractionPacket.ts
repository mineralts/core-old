import { Assembler } from '@mineralts/assembler'
import { CommandInteraction } from '@mineralts/api'
import Packet from '../entities/Packet'
import CommandInteractionBuilder from '../builders/CommandInteractionBuilder'

export default class CommandInteractionPacket extends Packet {
  public packetType = 'INTERACTION_CREATE'

  public async handle (assembler: Assembler, payload: any) {
    const client = assembler.application.client
    const container = assembler.application.container

    const guild = client.guilds.cache.get(payload.guild_id)
    const member = guild?.members.cache.get(payload.member.user.id)

    const interactionBuilder = new CommandInteractionBuilder(assembler.application.client, member!)
    const interaction: CommandInteraction = interactionBuilder.build(payload)

    let targetCommand: any | null = null

    container.commands.forEach((command) => {
      if (command.data.label === payload.data.name) {
        const subcommands: any[] = command.data.options.filter((command) => command.type === 'SUB_COMMAND')

        if (subcommands.length) {
          // Command with sub-commands
          const subcommand = subcommands.find((command) => command.name === payload.data.options[0].name)
          const targetSubcommandName = `${payload.data.name}.${subcommand.name}`
          targetCommand = container.subcommands.find((subcommand) => (
            subcommand.data.identifier === targetSubcommandName
          ))
        } else {
          // Simple command without subcommands
          targetCommand = container.commands.find((command) => (
            command.data.label === payload.data.name
          ))
        }
      }
    })

    await targetCommand.run(interaction)

    assembler.eventListener.emit('commandInteraction', interaction)
  }
}