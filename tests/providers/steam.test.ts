import { baseUrl, getSteamGame, getSteamStatus, steamProfile } from '@/lib/integrations/providers/steam/provider'
import { GetPlayerSummariesApiResponse, SteamProfile } from '@/lib/integrations/providers/steam/types'
import * as ofetch from 'ofetch'
import { describe, expect, it, vi } from 'vitest'

const STEAM_ID = '76561198000000000' // 17 digits

const steamPlayer = {
  steamid: STEAM_ID,
  profileurl: 'https://steamcommunity.com/id/example/',
  avatarfull: 'https://avatars.example/123.jpg',
  lastlogoff: 1690000000,
  personaname: 'Gamer',
  personastate: 1,
  realname: 'John Doe',
  loccountrycode: 'US',
  gameid: '570',
  gameextrainfo: 'Dota 2',
  avatar: 'https://avatars.example/123.jpg',
  communityvisibilitystate: 3,
  avatarhash: '1234567890abcdef1234567890abcdef12345678',
  avatarmedium: 'https://avatars.example/123_medium.jpg',
  primaryclanid: '103582791429521412',
  profilestate: 1,
  timecreated: 1262304000,
}

const steamResponse: GetPlayerSummariesApiResponse = {
  response: {
    players: [steamPlayer],
  },
}

vi.mock('ofetch', async (importOriginal) => {
  const original = await importOriginal<typeof ofetch>()

  return {
    ...original,
    ofetch: vi.fn().mockImplementation(async () => Promise.resolve(steamResponse)),
  }
})

const ofetchSpy = vi.spyOn(ofetch, 'ofetch')

describe('steam profile', () => {
  process.env.STEAM_API_KEY = 'test-key'

  it('validates 17-digit Steam IDs', () => {
    expect(steamProfile.validate(STEAM_ID)).toBe(true)
    expect(steamProfile.validate('123')).toBe(false)
    expect(steamProfile.validate('abc76561198000000000')).toBe(false)
  })

  it('fetches and maps a profile with current game & country', async () => {
    const result = await steamProfile.getCached(STEAM_ID)

    expect(ofetchSpy).toHaveBeenCalledWith(
      `/ISteamUser/GetPlayerSummaries/v2/?key=${process.env.STEAM_API_KEY}&steamids=${STEAM_ID}`,
      expect.objectContaining({
        baseURL: baseUrl,
        headers: { 'Content-Type': 'application/json' },
        method: 'GET',
      }),
    )

    expect(result).toStrictEqual(
      expect.objectContaining<SteamProfile>({
        steamId: STEAM_ID,
        url: steamPlayer.profileurl,
        avatar: steamPlayer.avatarfull,
        displayName: steamPlayer.personaname,
        realName: steamPlayer.realname,
        country: { code: 'US', name: 'United States' },
        lastLoggedOff: new Date(1690000000),
        game: getSteamGame(steamPlayer),
        status: getSteamStatus(steamPlayer.personastate),
      }),
    )
  })
})
