import { ONE_HOUR_IN_SECONDS } from '@/lib/constants/revalidates'
import type { DiscordInvite, DiscordInviteApiResponse } from '@/lib/integrations/providers/discord/invite/types'
import { EmbedProvider } from '@/lib/integrations/providers/EmbedProvider'
import { EmbedType } from '@/lib/integrations/providers/schemas'
import { ofetch } from 'ofetch'
import { match } from 'ts-pattern'

export const url = new URL('https://discord.com')

export const discordInvite = new EmbedProvider<DiscordInvite>({
  type: EmbedType.DiscordInvite,
  cache: ONE_HOUR_IN_SECONDS,
  fetch: async (code: string): Promise<DiscordInvite> => {
    const data = await ofetch<DiscordInviteApiResponse>(`/api/v10/invites/${code}`, {
      baseURL: url.origin,
      query: { with_counts: 'true' },
    })

    return {
      code: data.code,
      imageUrl: cdn(data.guild, 'icon'),
      bannerUrl: cdn(data.guild, 'banner'),
      onlineCount: data.approximate_presence_count,
      memberCount: data.approximate_member_count,
      name: data.guild.name,
      description: data.guild.description,
      isCommunityServer: data.guild.features.includes('COMMUNITY'),
    }
  },
  validate: (code: string) => /^[a-zA-Z0-9-]{2,128}$/.test(code),
})

function cdn(guild: DiscordInviteApiResponse['guild'], type: 'icon' | 'banner') {
  const hash = guild[type]

  if (!hash) return

  const isAnimated = hash.startsWith('a_') || hash.startsWith('ANIMATED_')
  const ext = isAnimated ? 'gif' : 'png'

  let url = `https://cdn.discordapp.com/${type}s/${guild.id}/${hash}.${ext}`

  return match(type)
    .with('banner', () => url + '?size=1024')
    .otherwise(() => url)
}
