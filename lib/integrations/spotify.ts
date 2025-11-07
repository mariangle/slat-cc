import { FedsServerError } from '@/lib/server/errors'
import { ofetch } from 'ofetch'
import { spotifyParser } from './providers/EmbedParser'

interface SpotifyTokenResponse {
  access_token: string
  token_type: 'Bearer'
  expires_in: number
}

interface SpotifyImage {
  url: string
  width: number | null
  height: number | null
}

interface SpotifyExternalUrls {
  spotify: string
}

interface SpotifyArtist {
  id: string
  name: string
  external_urls: SpotifyExternalUrls
}

interface SpotifyAlbum {
  id: string
  name: string
  images: SpotifyImage[]
  external_urls: SpotifyExternalUrls
}

interface SpotifyTrack {
  id: string
  name: string
  artists: SpotifyArtist[]
  album: SpotifyAlbum
  explicit: boolean
  duration_ms: number
  preview_url: string | null
  external_urls: SpotifyExternalUrls
}

export async function getSpotifyTrack(url: string): Promise<SpotifyTrack | undefined> {
  const spotifyContent = spotifyParser(url)

  if (!spotifyContent)
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Invalid Spotify track URL',
    })

  if (['playlist', 'album'].includes(spotifyContent.type)) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Invalid Spotify track URL',
    })
  }

  const { identifier: trackId } = spotifyContent

  const authorization = await authorize()

  return await ofetch<SpotifyTrack>(`/tracks/${trackId}`, {
    baseURL: 'https://api.spotify.com/v1',
    headers: { Authorization: `${authorization.token_type} ${authorization.access_token}` },
  })
}

async function authorize(): Promise<SpotifyTokenResponse> {
  return await ofetch<SpotifyTokenResponse>('/api/token', {
    baseURL: 'https://accounts.spotify.com',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization:
        'Basic ' +
        Buffer.from(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET).toString('base64'),
    },
    params: {
      grant_type: 'client_credentials',
    },
  })
}
