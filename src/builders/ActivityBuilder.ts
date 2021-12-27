import { Emoji, Activity, ActivityType } from '@mineralts/api'
import { DateTime } from 'luxon'

export default class ActivityBuilder {
  public build (payload: any) {
    const emoji = new Emoji(
      payload.emoji?.id,
      payload.emoji?.name,
      false,
      false,
      payload.emoji?.animated,
    )

    const start = payload.timestamps?.start
    const end = payload.timestamps?.end

    const timestamps = {
      start: start ? DateTime.fromMillis(start) : undefined,
      end: end ? DateTime.fromMillis(end) : undefined
    }

    return new Activity(
      payload.id,
      ActivityType[payload.type as number] as any,
      payload.description,
      payload.name,
      payload.emoji ? emoji : undefined,
      timestamps,
      payload.state,
      payload.detail,
      {
        smallText: payload.assets?.small_text,
        smallImage: payload.assets?.small_image,
        largeText: payload.assets?.large_text,
        largeImage: payload.assets?.large_image,
      },
      payload.buttons,
      payload.sync_id,
      payload.session_id,
      DateTime.fromMillis(payload.created_at),
      payload.application_id,
    )
  }
}