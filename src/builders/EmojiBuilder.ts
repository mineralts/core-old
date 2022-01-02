import { Emoji } from '@mineralts/api'

export default class EmojiBuilder {
  public build (payload: any) {
    return new Emoji(
      payload.id,
      payload.name,
      payload.managed,
      payload.available,
      payload.animated,
    )
  }
}