/*
 * packages/index.ts
 *
 * (c) Parmantier Baptiste
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 *
 */

import path from 'path'
import fs from 'fs'
import Logger from '@mineralts/logger'
import Application from '@mineralts/application'

export default class Generator {
  private root = path.join(process.cwd(), 'src')
  private moduleLocation!: string
  private filename!: string
  public template!: string
  private location! : string[]

  constructor (private logger: Logger) {
  }

  public async write (module: string, args: string[]) {
    const [loc] = args

    const templateLocation = path.join(__dirname, '..', '..', '..', 'src', 'templates', `${module}.txt`)
    this.template = await fs.promises.readFile(templateLocation, 'utf-8')

    const folders = loc.split('/')
    this.location = folders.slice(0, folders.length - 1)
    this.filename = `${folders.at(-1)}.ts`

    this.moduleLocation = path.join(this.root, ...this.location, this.filename)

    await this.buildFolders()
    await this.writeFile()
    this.end()
  }

  public buildFolders () {
    return fs.promises.mkdir(path.join(this.root, ...this.location), { recursive: true })
  }

  public writeFile () {
    return fs.promises.writeFile(
      path.join(this.root, ...this.location, this.filename),
      this.template
        .replaceAll('$moduleName', this.filename.split('.')[0])
        .replaceAll('$moduleNameLowercase', this.filename.split('.')[0].toLowerCase())
        .replaceAll('$moduleClass', Application.getHelper().capitalCase(this.filename.split('.')[0]).replace(/ /g, ''))
    )
  }

  private end () {
    const finalLocation = this.moduleLocation
      .replace(this.root, 'App')
      .replaceAll(path.sep, '/')

    this.logger.info(`The order file has been generated in ${finalLocation}`)
  }
}