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
  public static commandName = 'make:event'
  public static description = 'Make a new event class'

  public static settings = {
    loadApp: true
  }

  public async run (...args: string[]): Promise<void> {
    const generator = new Generator(this.logger)
    await generator.write('event', args)
    await generator.buildFolders()

    await generator.writeFile()
  }
}