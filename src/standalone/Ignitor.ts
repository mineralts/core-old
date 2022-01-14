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

export default class Ignitor {
  public async forge () {
    const forgeFile = path.join('node_modules', '@mineralts', 'core', 'build', 'src', 'forge')
    const argv = process.argv.slice(2)
    const stringArgs = argv.join(' ')

    const tsnode = path.join(process.cwd(), 'node_modules', 'ts-node', 'dist', 'bin.js')
    const command = `node ${tsnode} ${forgeFile} ${stringArgs}`

    try {
      const { stdout, stderr } = await exec(command, {
        cwd: process.cwd(),
      })

      stdout?.pipe(process.stdout)
      stderr?.pipe(process.stderr)
    } catch (e) {
      console.log(e)
    }
  }
}