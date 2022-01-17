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
import path from 'path'

export default class MakeCommand extends Command {
  public static commandName = 'info'
  public static description = 'Displays the current information about your project'

  public static settings = {
    loadApp: true
  }

  public async run (): Promise<void> {
    const jsonPackage = await import(path.join(process.cwd(), 'package.json'))

    const result = {
      appName: jsonPackage.name,
      appVersion: jsonPackage.version,
      appIntents: this.application.intents,
      packages: {},
      rcFile: this.application.rcFile,
      commands: this.application.commands
    }

    Object.entries(jsonPackage.dependencies).forEach(([key, version]) => {
      if (key.startsWith('@mineralts')) {
        result.packages[key] = version
      }
    })

    console.debug(result)
  }
}