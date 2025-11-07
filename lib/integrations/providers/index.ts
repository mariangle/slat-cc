import { discordInvite } from './discord/invite/provider'
import { discordPresence } from './discord/presence/provider'
import { EmbedProvider } from './EmbedProvider'
import { githubProfile } from './github/provider'
import { robloxProfile } from './roblox/provider'
import { steamProfile } from './steam/provider'
import { valorantProfile } from './valorant/provider'
import { youtubeChannel } from './youtube/provider'

export const embedProviders: EmbedProvider<unknown>[] = [
  discordPresence,
  discordInvite,
  robloxProfile,
  githubProfile,
  steamProfile,
  valorantProfile,
  youtubeChannel,
]
