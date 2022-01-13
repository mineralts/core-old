/*
 * packages/index.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import Kernel from '../Kernel'
import Environment from '../Environment'
import Logger from '@mineralts/logger'
import path from 'path'

class Forge {
  public async handle (inputArguments: string[]) {
    const logger = new Logger
    const environment = new Environment()
    environment.registerEnvironment()

    const token = environment.cache.get<string>('TOKEN')

    if (!token) {
      logger.fatal('Token was not provided')
      process.exit(1)
    }

    const kernel = new Kernel(token)
    await kernel.application.registerCliCommands()

    const [commandName, ...args] = inputArguments

    if (commandName === 'generate:manifest' || commandName === 'help' || !commandName) {
      const command = kernel.application.commands.get(commandName || 'help')
      await command.run()
    } else {
      const forgeManifest = await import(path.join(process.cwd(), 'forge-manifest.json'))
      const forgeCommand = forgeManifest.commands.find((command: { commandName: string }) => (
        command.commandName === commandName
      ))

      if (!forgeCommand) {
        logger.error('Command not found.')
        return
      }

      const location = forgeCommand.path.startsWith('/')
        ? path.join(process.cwd(), forgeCommand.path)
        : path.join(process.cwd(), 'node_modules', forgeCommand.path)

      const { default: Command } = await import(location)
      const command = new Command()

      command.logger = logger
      command.application = kernel.application

      await command.run(...args)
    }
  }
}

new Forge()
  .handle(process.argv.slice(2))