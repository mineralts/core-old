/*
 * packages/Ignitor.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { exec } from 'child_process'
import path from 'path'
import Kernel from '../Kernel'
import Logger from '@mineralts/logger'
import Environment from '../Environment'

export default class Ignitor {
  private logger: Logger = new Logger
  private environment: Environment = new Environment()

  public async forge () {
    const [commandName, ...args] = process.argv.slice(2)

    this.environment.registerEnvironment()

    if (commandName === 'generate:manifest' || commandName === 'help' || !commandName) {
      await this.execTypescript(commandName, ...args)
    } else {
      await this.execJavascript(commandName, ...args)
    }
  }

  private async execTypescript (commandName: string, ...args: string[]) {
    const forgeFile = path.join('node_modules', '@mineralts', 'core', 'build', 'src', 'forge')
    const stringArgs = args.slice(1).join(' ')

    const tsnode = path.join(process.cwd(), 'node_modules', 'ts-node', 'dist', 'bin.js')
    const command = `node ${tsnode} ${forgeFile} ${stringArgs}`

    const { stdout, stderr, stdin } = await exec(command, {
      cwd: process.cwd(),
      env: {
        TOKEN: this.environment.cache.get<string>('TOKEN'),
        COMMAND_NAME: commandName,
        ARGS: stringArgs
      }
    })

    stdout?.pipe(process.stdout)
    stderr?.pipe(process.stderr)
    process.stdin.pipe(stdin!)
  }

  private async execJavascript (commandName: string, ...args: string[]) {
    const token = this.environment.cache.get<string>('TOKEN')

    if (!token) {
      this.logger.fatal('Token was not provided')
      process.exit(1)
    }

    const kernel = new Kernel(token)
    await kernel.application.registerCliCommands()

    const command = kernel.application.commands.get(commandName)

    if (!command) {
      this.logger.error('Command not found.')
      return
    }

    await command.run(...args)
  }
}