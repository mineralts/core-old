/*
 * packages/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Command } from '@mineralts/forge'
import Generator from '../Generator'

export default class GenerateManifest extends Command {
  public static commandName = 'make:command'
  public static description = 'Make a new command class'

  public async run (...args: string[]): Promise<void> {
    const generator = new Generator(this.logger)

    await generator.write('command', args)
    await generator.buildFolders()
    await generator.writeFile()
  }
}