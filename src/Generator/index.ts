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
  private dirs: string[] = []

  constructor (private logger: Logger) {
  }

  public setFilename (value: string) {
    this.filename = Application.getHelper()
      .capitalCase(value)
      .replace(/(.*)\.[^.]+$/, '')

    return this
  }

  public setTemplate (value: string) {
    this.template = value
    return this
  }

  public setLocation (value: string) {
    this.location = value.startsWith('App')
      ? value.split('/').slice(1)
      : value.split('/')

    return this
  }

  public async write () {
    this.template = await fs.promises.readFile(this.template, 'utf-8')
    this.moduleLocation = path.join(this.root, ...this.location, this.filename)
    return this.writeFile()
  }

  public buildFolders () {
    const dir = path.join(this.root, ...this.location)
    const hasFolder = fs.existsSync(dir)

    if (!hasFolder) {
      return fs.promises.mkdir(dir, { recursive: true })
    }
  }

  public async writeFile () {
    await fs.promises.writeFile(
      path.join(this.root, ...this.location, `${this.filename}.ts`),
      this.template
        .replaceAll('$Class', this.filename)
    )

    const finalLocation = this.moduleLocation
      .replace(this.root, 'App')
      .replaceAll(path.sep, '/')

    this.logger.info(`The order file has been generated in ${finalLocation}`)
  }

  public async loadFolders (directory: string) {
    const fileOrFolders = await fs.promises.readdir(directory, { encoding: 'utf-8' })

    await Promise.all(
      fileOrFolders.map(async (object) => {
        const dirPath = path.join(directory, object)
        const item = await fs.promises.stat(dirPath)

        const currentDir = dirPath.replace(path.join(process.cwd(), 'src'), 'App').split(path.sep)

        const dir = currentDir.slice(0, currentDir.length - 1).join('/')

        if (!this.dirs.includes(dir)) {
          this.dirs.push(dir)
        }

        if (item.isDirectory()) {
          return this.loadFolders(dirPath)
        }
      })
    )
  }

  public getFolders () {
    return this.dirs
  }
}