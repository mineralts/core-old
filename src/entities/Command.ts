import Logger from '@mineralts/logger'
import { Client, CommandOption, OptionType, Snowflake } from '@mineralts/api'

export function Command (name: string, description: string, scope: 'GUILDS' | Snowflake) {
  return (target: any) => {
    target.identifier = 'slash-command'

    if (!target.prototype.data) {
      target.prototype.data = {}
    }

    target.prototype.data.label = name
    target.prototype.data.scope = scope
    target.prototype.data.description = description
  }
}

export function Option<T extends keyof typeof OptionType | 'CHOICE'> (type: T, opt: CommandOption<T>) {
  return (target: any) => {
    if (!target.prototype.data) {
      target.prototype.data = {}
    }

    if (!target.prototype.data.options) {
      target.prototype.data.options = []
    }

    target.prototype.data.options.push({ type, ...opt })
  }
}

export abstract class MineralCommand {
  public logger!: Logger
  public client!: Client

  public getLabel!: () => string
  public getDescription!: () => string

  // @ts-ignore
  public getOption<T extends keyof typeof OptionType | 'CHOICE'> (type: T, name: string): CommandOption<T>

  abstract run (...args: any[]): Promise<void>
}