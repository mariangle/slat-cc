import { withSessionUser } from '@/lib/api/middleware/user'
import { db, schema } from '@/lib/drizzle'
import { UploadedFile } from '@/lib/media/media'
import { FedsServerError } from '@/lib/server/errors'
import { DiscordWebhook, webhooks } from '@/lib/webhook'
import { customAlphabet } from 'nanoid'
import { after, NextResponse } from 'next/server'
import { ofetch } from 'ofetch'

type XoaApiResponse = {
  data: {
    cdn_url: string
    key: string
  }
}

const nanoid = customAlphabet('23456789abcdefghjkmnpqrstuvwxyz', 6)

const buildFilename = (name: string) => {
  // normalize & strip paths
  const base = name.normalize('NFC').replaceAll('\\', '/').split('/').pop() || 'file'

  // extract extension
  const match = base.match(/\.[^.]+$/)
  const ext = match ? match[0].toLowerCase() : ''
  const withoutExt = ext ? base.slice(0, -ext.length) : base

  // sanitize base
  const safe =
    withoutExt
      .replace(/\s+/g, '-') // spaces → dashes
      .replace(/[^a-zA-Z0-9_.-]/g, '') // keep only safe chars
      .replace(/-+/g, '-') // collapse dashes
      .replace(/^[-_.]+|[-_.]+$/g, '') // trim noise
      .toLowerCase() || 'file'

  // add tiny collision suffix
  return `${safe}-${nanoid()}${ext}`
}

/** POST /api/upload - Upload a file to Xoa */
export const POST = withSessionUser()(async ({ req, user }): Promise<NextResponse<UploadedFile>> => {
  if (!process.env.XOA_API_KEY) {
    throw new Error('XOA_API_KEY is not set')
  }

  const formData = await req.formData()

  const file = formData.get('file')

  if (!file || !(file instanceof Blob)) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'No file found in request',
    })
  }

  const uploadFormData = new FormData()

  const originalFilename = file.name
  const filename = buildFilename(file.name)

  uploadFormData.append('file', file, 'file')
  uploadFormData.append('original_name', filename)
  const {
    data: { cdn_url: url },
  } = await ofetch<XoaApiResponse>('https://api.xoa.me/v1/upload', {
    method: 'POST',
    headers: {
      Authorization: process.env.XOA_API_KEY,
    },
    body: uploadFormData,
    onResponseError({ response }) {
      throw new Error(response._data?.message || 'Xoa API error')
    },
  })

  await db.insert(schema.uploads).values({
    userId: user.id,
    filename,
    originalFilename,
    mimeType: file.type,
    size: file.size,
    url,
  })

  after(async () => {
    await new DiscordWebhook(webhooks.uploads).send({
      title: DiscordWebhook.title(user),
      url: DiscordWebhook.profileUrl(user.username),
      description: `📤 **${user.username}** uploaded a new file:`,
      actor: user,
      fields: [
        {
          name: 'Filename',
          value: filename,
        },
        {
          name: 'URL',
          value: url,
        },
        {
          name: 'Size',
          value: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
        },
      ],
    })
  })

  return NextResponse.json({
    size: file.size,
    url,
    mimeType: file.type,
    filename,
  })
})
