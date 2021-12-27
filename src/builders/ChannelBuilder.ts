import {
  CategoryChannel,
  ChannelResolvable,
  ChannelTypeResolvable,
  Client,
  Guild,
  MessageManager,
  RTC_Region,
  TextChannel,
  VideoQuality,
  VoiceChannel
} from '@mineralts/api'
import Logger from '@mineralts/logger'
import { keyFromEnum } from '../utils'

export default class ChannelBuilder {
  constructor (private client: Client, private logger: Logger, private guild: Guild) {
  }

  public build (payload: any): ChannelResolvable {
    const channels = {
      [ChannelTypeResolvable.GUILD_TEXT]: () => this.createTextChannel(payload),
      [ChannelTypeResolvable.GUILD_VOICE]: () => this.createVoiceChannel(payload),
      [ChannelTypeResolvable.GUILD_CATEGORY]: () => this.createCategoryChannel(payload),
      unknown: () => {
        this.logger.warn(`Channel not supported : ${payload.type}`)
        return undefined
      }
    }
    return (channels[payload.type] || channels.unknown)()
  }

  private createTextChannel (payload: any) {
    return new TextChannel(
      payload.id,
      payload.name,
      payload.topic,
      this.guild.id,
      this.guild,
      payload.last_message_id,
      // @Todo Get lasted message
      undefined,
      payload.parent_id,
      payload.permission_overwrites,
      payload.position,
      payload.rate_limit_per_user,
      new MessageManager(),
      payload.nsfw,
      undefined
    )
  }

  private createVoiceChannel (payload: any) {
    return new VoiceChannel(
      payload.id,
      payload.name,
      this.guild.id,
      this.guild,
      payload.user_limit,
      keyFromEnum(RTC_Region, payload.rtc_region) as keyof typeof RTC_Region,
      payload.rate_limit_per_user,
      payload.position,
      payload.permission_overwrites,
      payload.parent_id,
      payload.bitrate,
      keyFromEnum(VideoQuality, payload.video_quality_mode) as keyof typeof VideoQuality,
      undefined
    )
  }

  private createCategoryChannel (payload: any) {
    return new CategoryChannel(
      payload.id,
      payload.position,
      payload.name,
      this.guild.id,
      this.guild
    )
  }
}