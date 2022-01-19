import Application from '@mineralts/application'
import { Assembler } from '@mineralts/assembler'
import { join } from 'path'
import fs from 'fs'
import PacketManager from './packets/PacketManager'

export default class Kernel {
  public application: Application
  private readonly assembler: Assembler
  private readonly packetManager: PacketManager

  constructor () {
    const JSON_PACKAGE = this.loadFile(join(process.cwd(), 'package.json'))
    const rcFile = this.loadRcFile()

    this.application = Application.create(process.cwd(), {
      appName: JSON_PACKAGE.name,
      version: JSON_PACKAGE.version,
      rcFile,
    })

    this.packetManager = new PacketManager()

    this.assembler = new Assembler(this.application, this.packetManager)
    this.application.environment.registerEnvironment()
  }

  public async createApplication () {
    await this.application.registerCliCommands()
    await this.assembler.build()

    this.application.registerBinding('request', this.assembler.connector.http)
  }


  protected loadRcFile () {
    try {
      const path = join(process.cwd(), '.mineralrc.json')
      return JSON.parse(fs.readFileSync(path, 'utf-8'))
    } catch (error) {
      throw new Error('Mineral expects ".mineralrc.json" file to exist in the application root')
    }
  }

  protected loadFile (filePath: string) {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
  }
}