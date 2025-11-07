'use client'

import { Container } from '@/components/profile/card/container'
import { Tooltip } from '@/components/ui/tooltip'
import { useViewsAnimation } from '@/hooks/use-views-animation'
import { Icons } from '@/lib/constants/icons'
import { ProfileModeId } from '@/lib/features/app'
import type { Config } from '@/lib/features/config/schemas'
import { isContainerTransparent } from '@/lib/features/config/utils/card-utils'
import { cn, formatNumber } from '@/lib/utils'
import { match } from 'ts-pattern'
import { Detail } from './details/detail'

interface ViewsProps {
  views: number
  config: Config
  className?: string
  preview?: boolean
}

export function Views({ views, config, className, preview }: ViewsProps) {
  const animatedViews = useViewsAnimation(views, config.enhancements.animateViews)

  const profileModeId = config.layout.profileModeId

  function getClassName() {
    return match({ profileModeId, preview })
      .with({ profileModeId: ProfileModeId.Showcase, preview: false }, () => cn(className))
      .otherwise(() => cn('absolute top-4 right-4', config.card.borderRadius > 40 && 'top-6 right-6', className))
  }

  return (
    <div className={getClassName()}>
      <Tooltip
        content={`${views} views`}
        className={cn(profileModeId === ProfileModeId.Default && config.media.banner && '-bottom-full')}
      >
        <ViewsContainer config={config}>
          <Detail
            icon={Icons.eye}
            config={config}
            label={formatNumber(animatedViews, { abbreviation: true })}
            key={views}
            className="text-sm"
          />
        </ViewsContainer>
      </Tooltip>
    </div>
  )
}

function ViewsContainer({ children, config }: React.PropsWithChildren<{ config: Config }>) {
  if (config.layout.profileModeId === ProfileModeId.Showcase) return <>{children}</>

  return (
    <Container
      borderRadius={config.card.borderRadius}
      container={config.container}
      className={cn(!isContainerTransparent(config.container) && 'px-2.5 py-1')}
      isInsideProfileCard
    >
      {children}
    </Container>
  )
}
