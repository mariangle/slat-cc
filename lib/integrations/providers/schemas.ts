import * as z from 'zod'

export enum EmbedType {
  GitHubProfile = 'github-profile',
  DiscordPresence = 'discord-presence',
  DiscordInvite = 'discord-invite',
  YoutubeVideo = 'youtube-video',
  YoutubeChannel = 'youtube-channel',
  RobloxProfile = 'roblox-profile',
  SoundcloudTrack = 'soundcloud-track',
  SoundcloudPlaylist = 'soundcloud-playlist',
  SoundcloudAlbum = 'soundcloud-album',
  TwitchChannel = 'twitch-channel',
  SteamProfile = 'steam-profile',
  SpotifyTrack = 'spotify-track',
  SpotifyAlbum = 'spotify-album',
  SpotifyPlaylist = 'spotify-playlist',
  ValorantProfile = 'valorant-profile',
}

export const embedTypeSchema = z.nativeEnum(EmbedType)

export type EmbedStatus = 'gray' | 'green' | 'yellow' | 'red' | 'purple'

export type EmbedIntegration = {
  type: EmbedType
  identifier: string
}
