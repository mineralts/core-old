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
import { prompt } from 'enquirer'
import { clientEvents } from '@mineralts/api'
import path from 'path'

export default class GenerateManifest extends Command {
  public static commandName = 'make:event'
  public static description = 'Make a new event class'

  public async run (...args: string[]): Promise<void> {
    const generator = new Generator(this.logger)
    await generator.loadFolders(path.join(process.cwd(), 'src'))

    const location = {
      type: 'autocomplete',
      name: 'filename',
      message: 'Please define path location',
      limit: 3,
      choices: generator.getFolders()
    }

    const filename = {
      type: 'input',
      name: 'filename',
      message: 'Please define a name for your file'
    }

    const eventType = {
      type: 'autocomplete',
      name: 'event',
      message: 'Please select an event',
      limit: 5,
      choices: clientEvents
    }

    const answers = await prompt([filename, location, eventType]) as { filename, location, eventType }
    // generator.setFilename(answers.filename)

    // await generator.write('event', args)
    // await generator.buildFolders()
    //
    // await generator.writeFile()
  }
}