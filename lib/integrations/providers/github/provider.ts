import { ONE_DAY_IN_SECONDS } from '@/lib/constants/revalidates'
import { EmbedProvider } from '@/lib/integrations/providers/EmbedProvider'
import { GithubProfile, GithubProfileApiResponse } from '@/lib/integrations/providers/github/types'
import { EmbedType } from '@/lib/integrations/providers/schemas'
import { ofetch } from 'ofetch'

const url = new URL('https://api.github.com')

export const githubProfile = new EmbedProvider<GithubProfile>({
  type: EmbedType.GitHubProfile,
  cache: ONE_DAY_IN_SECONDS,
  fetch: async (username): Promise<GithubProfile> => {
    if (!process.env.GITHUB_API_KEY) throw new Error('GITHUB_API_KEY is not set')

    const data = await ofetch<GithubProfileApiResponse>(`/users/${username}`, {
      baseURL: url.origin,
      headers: {
        Authorization: `token ${process.env.GITHUB_API_KEY}`,
        'Content-Type': 'application/json',
        'User-Agent': 'feds.lol',
      },
    })

    return {
      username: data.login,
      avatarUrl: data.avatar_url,
      followers: data.followers,
      following: data.following,
      name: data.name || undefined,
      location: data.location || undefined,
      company: data.company || undefined,
      blog: data.blog || undefined,
      bio: data.bio || undefined,
      publicRepos: data.public_repos,
      createdAt: new Date(data.created_at).toISOString(),
    }
  },
  validate: (username) => /^[a-zA-Z0-9-]{1,39}$/.test(username),
})
