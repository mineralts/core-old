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
import { execSync } from 'child_process'
import path from 'path'

export default class ServerDev extends Command {
  public static commandName = 'server:dev'
  public static description = 'Starting the application in development mode'

  public async run (): Promise<void> {
    const jsonPackage = await import(path.join(process.cwd(), 'package.json'))
    const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')

    console.clear()
    this.logger.info(`Starting the application ${jsonPackage.name}`)
    this.logger.info('Watching file system for changes...\n')

    execSync(`node ${esbuild} start/index.ts --commands --watch --supervise`, {
      cwd: process.cwd(),
      stdio: 'inherit',
    })

    process.exit()
  }
}