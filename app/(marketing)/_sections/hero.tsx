'use client'

import { Beam } from '@/app/(marketing)/_components/beam'
import { ClaimYourLink } from '@/app/(marketing)/_components/claim-your-link'
import { Heading } from '@/app/(marketing)/_components/heading'
import Image from 'next/image'

export function Hero() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-20 md:px-8 md:py-34">
      <Image
        src="/assets/bg-blur-2.webp"
        alt="Background"
        width={250}
        unoptimized
        height={250}
        style={{ opacity: 0.75 }}
        className="absolute top-1/2 left-1/2 -z-10 w-full max-w-3xl -translate-x-1/2 -translate-y-1/2 object-cover"
      />
      <div className="mx-auto flex max-w-(--breakpoint-lg) flex-col items-center justify-center text-center">
        <Heading
          level={1}
          className="text-foreground/85 mx-auto mb-10 max-w-4xl text-5xl font-semibold tracking-tight md:text-7xl"
        >
          Your digital identity, <br />
          <span className="text-foreground">simplified.</span>
        </Heading>
        <p className="mx-auto mb-8 max-w-lg text-base md:text-lg">
          Create stunning bio links, showcase your content, and connect with your audience. feds.lol gives you the tools
          to build your online presence — beautifully.
        </p>
        <ClaimYourLink className="mb-10" />
        <div className="relative max-w-7xl overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-800/50 p-2 backdrop-blur-lg md:rounded-[32px] md:p-3">
          <Beam className="absolute -top-px" />
          <Beam className="absolute -top-px" />
          <div className="rounded-xl border border-neutral-800 bg-black p-1.5 sm:rounded-[1.4rem]">
            <Image
              src="/images/dashboard.png"
              alt="Hero Image"
              className="h-full w-full rounded-xl border border-white/10 object-cover shadow-[0_0px_1px_--theme(--color-neutral-300/.2)] sm:rounded-[1.4rem]"
              width={1920}
              height={1080}
              quality={100}
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
