import { Heading } from '@/app/(marketing)/_components/heading'
import { buttonVariants } from '@/components/ui/button'
import { paths } from '@/lib/routes/paths'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type ErrorConfig = {
  title: string
  description: string
  primary?: { label: string; href: string }
  secondary?: { label: string; href: string }
}

const DEFAULTS: Record<number, ErrorConfig> = {
  401: {
    title: 'Unauthorized',
    description: 'You need to sign in to access this page.',
    primary: { label: 'Sign in', href: paths.auth.login },
    secondary: { label: 'Create account', href: paths.auth.register },
  },
  403: {
    title: 'Forbidden',
    description: "You don't have permission to view this page.",
    primary: { label: 'Go home', href: paths.root },
  },
  404: {
    title: 'Page not found',
    description: 'The page you’re looking for doesn’t exist or has moved.',
    primary: { label: 'Go home', href: paths.root },
  },
  429: {
    title: 'Too many requests',
    description: 'You’ve hit a rate limit. Please try again in a moment.',
    primary: { label: 'Try again', href: paths.root },
  },
  500: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred. Please try again later.',
    primary: { label: 'Go home', href: paths.root },
  },
  503: {
    title: 'Service unavailable',
    description: 'This feature is temporarily down for maintenance.',
    primary: { label: 'Status page', href: '/status' },
    secondary: { label: 'Go home', href: paths.root },
  },
}

type ErrorPageProps = {
  code: number
  title?: string
  description?: string
}

export function ErrorPage({ code, title, description }: ErrorPageProps) {
  const preset = DEFAULTS[code]
  const desc = description ?? preset.description

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center overflow-x-hidden p-4">
      <Image
        src="/images/waves.svg"
        width={32}
        height={32}
        alt="abstract waves"
        aria-hidden="true"
        className="pointer-events-none absolute top-0 left-1/2 -z-10 h-2/3 w-full max-w-5xl -translate-x-1/2 transform object-cover opacity-25 hue-rotate-[0deg]"
      />
      <main className="flex flex-col items-center gap-5 text-center">
        <Heading level={1} className="text-foreground text-5xl font-bold md:text-7xl">
          {code}
        </Heading>
        <div className="space-y-1.5">
          <div className="text-foreground text-lg font-semibold">{preset.title}</div>
          <p className="text-muted-foreground max-w-prose">{desc}</p>
        </div>
        <div className="mt-2 flex flex-wrap items-center justify-center gap-3">
          {preset.secondary && (
            <Link href={preset.secondary.href} className={cn(buttonVariants({ variant: 'secondary' }))}>
              {preset.secondary.label}
            </Link>
          )}
          {preset.primary && (
            <Link href={preset.primary.href} className={cn(buttonVariants({ variant: 'primary-gradient' }))}>
              {preset.primary.label}
            </Link>
          )}
        </div>
      </main>
    </div>
  )
}
