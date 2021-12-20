import Logger from '@mineralts/logger'

export function Event (event) {
  return (target: any) => {
    target.identifier = 'event'
    target.event = event
  }
}

export abstract class MineralEvent {
  public logger!: Logger
  abstract run (...args: any[]): Promise<void>
}