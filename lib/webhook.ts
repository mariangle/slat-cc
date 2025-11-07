import { WEBSITE } from '@/lib/config'
import type { Author } from '@/lib/data/users/schemas'
import { isProduction } from '@/lib/utils'
import { ofetch } from 'ofetch'

export type DiscordEmbedField = {
  name: string
  value: string
  inline?: boolean
}

type WebhookAuthorization = {
  id: string
  token: string
}

export interface SendPayload {
  actor?: Actor
  title: string
  url?: string
  color?: number
  fields?: DiscordEmbedField[]
  description: string
}

export const webhooks: Record<string, WebhookAuthorization> = {
  orders: {
    id: '',
    token: '',
  },
  casinoGame: {
    id: '',
    token: '',
  },
  badges: {
    id: '',
    token: '',
  },
  registrations: {
    id: '',
    token: '',
  },
  warnings: {
    id: '',
    token: '',
  },
  uploads: {
    id: '',
    token: '',
  },
  giveaways: {
    id: '',
    token: '',
  },
  cron: {
    id: '',
    token: '',
  },
}

export class DiscordWebhook {
  readonly webhook: WebhookAuthorization

  constructor(webhook: WebhookAuthorization) {
    this.webhook = webhook
  }

  static colors: Record<string, number> = {
    green: 0x01f700,
    red: 0xbb171a,
    blue: 0x0000ff,
    yellow: 0xeab308,
    orange: 0xffa500,
    pink: 0xdb2777,
    purple: 0x3730a3,
  }

  async send({ author, title, url, color, fields, description }: SendPayload) {
    if (!isProduction()) {
      console.info('Discord webhook not sent in development mode')
      return
    }

    const embed: Record<string, unknown> = {
      title,
      timestamp: DiscordWebhook.now(),
      description,
      ...(url && { url }),
      ...(color && { color }),
      ...(author && { author: DiscordWebhook.author(author), footer: DiscordWebhook.footer(author.id) }),
      ...(fields && fields.length > 0 && { fields }),
    }

    await ofetch(`/${this.webhook.id}/${this.webhook.token}`, {
      baseURL: 'https://discord.com/api/webhooks',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: {
        tts: false,
        embeds: [embed],
      },
    })
  }

  static now(): string {
    return new Date().toISOString()
  }

  static profileUrl(username: string): string {
    return `${WEBSITE.baseUrl}/${username}`
  }

  static footer(userId: number) {
    return { text: `By User ID: ${userId}` }
  }

  static title(author: Author): string {
    return `@${author.username} (UID: ${author.id})`
  }

  static author(author: Author) {
    return {
      name: `@${author.username}`,
      icon_url: author.avatar ?? undefined,
      url: this.profileUrl(author.username),
    }
  }
}
