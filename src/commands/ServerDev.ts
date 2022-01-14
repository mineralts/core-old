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
import { exec } from 'child_process'
import path from 'path'

export default class ServerDev extends Command {
  public static commandName = 'server:dev'
  public static description = 'Starting the application in development mode'

  public async run (): Promise<void> {
    const esbuild = path.join(process.cwd(), 'node_modules', 'esbuild-dev', 'pkg', 'esbuild-dev.bin.js')
    const { stdout, stderr } = exec(`node ${esbuild} start/index.ts --supervise --commands --watch`, {
      cwd: process.cwd()
    })

    stdout?.pipe(process.stdout)
    stderr?.pipe(process.stderr)
  }
}