/*
 * @mineralts/forge/MakeCommand.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import { Command } from '@mineralts/forge'
import path from 'path'
import { execSync } from 'child_process'

export default class ApplicationDev extends Command {
  public static commandName = 'app:dev'
  public static description = 'Starting the application in development mode'

  public async run (): Promise<void> {
    const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')

    execSync(`node ${esbuild} start/index.ts --commands --watch --supervise`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    })

    process.exit()
  }
}