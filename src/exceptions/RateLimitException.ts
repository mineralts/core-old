import Application from '@mineralts/application'

export default class RateLimitException {
  constructor (duration: number) {
    const logger = Application.getLogger()
    logger.warn(`You have been rate limit by the discord api, please try again in ${(duration / 1000).toFixed()} seconds.`)
  }
}