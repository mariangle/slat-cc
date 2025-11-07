import { Heading } from '@/app/(marketing)/_components/heading'
import { PricingCard } from '@/app/(marketing)/_components/pricing-card'
import { Container } from '@/components/shared/container'
import { plans } from '@/lib/constants/plans'
import Image from 'next/image'
import { FaGem } from 'react-icons/fa'

export function Premium() {
  return (
    <Container id="premium" as="section" className="space-y-12 py-32">
      <div className="relative flex flex-col items-center space-y-6 text-center">
        <div className="group text-evict-primary relative w-fit rounded-2xl border border-white/[0.03] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent">
          <FaGem className="text-primary-400 size-6" />
        </div>
        <Heading level={1} className="text-2xl md:text-4xl">
          Upgrade to{' '}
          <span className="from-primary-200 to-primary-100 bg-gradient-to-r bg-clip-text text-transparent">
            Premium
          </span>
        </Heading>
        <p className="text-muted-foreground max-w-prose text-base">
          Make your page pop with exclusive effects and features.
        </p>
        <Image
          alt="background blur"
          src="/assets/bg-blur-oval.webp"
          width={400}
          height={250}
          style={{ opacity: 0.25 }}
          aria-hidden="true"
          unoptimized
          className="absolute top-1/2 right-1/4 -z-10 w-full max-w-2xl -translate-y-[250px] object-cover"
        />
      </div>
      <PricingCards />
    </Container>
  )
}

async function PricingCards() {
  return (
    <div className="relative mx-auto grid max-w-2xl grid-cols-1 gap-8 md:grid-cols-2 md:gap-12">
      {Object.values(plans).map((plan) => (
        <PricingCard key={plan.title} plan={plan} />
      ))}
    </div>
  )
}
