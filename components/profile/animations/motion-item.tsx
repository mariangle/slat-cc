'use client'

import { cn } from '@/lib/utils'
import { motion, type Variants } from 'framer-motion'
import * as React from 'react'

type ItemPreset = 'fade' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'zoomIn' | 'blurIn'

type StaggerItemProps = {
  children: React.ReactNode
  /** preset animation to use (default: 'fadeUp') */
  preset?: ItemPreset
  /** item order for staggering (0-based). e.g. map index */
  i?: number
  /** seconds added per step; default 0.06 */
  step?: number
  /** base delay (seconds) applied to every item; default 0 */
  baseDelay?: number
  /** tuning */
  duration?: number
  ease?: any
  distance?: number // px for slide/fadeUp; default 16
  scaleFrom?: number // default 0.95
  blurFrom?: number // px; default 6
  /** viewport controls */
  once?: boolean
  amount?: number | 'some' | 'all'
  className?: string
}

function makeItemVariants({
  distance = 16,
  duration = 0.5,
  ease = 'easeOut',
  scaleFrom = 0.95,
  blurFrom = 6,
  delay = 0,
}: {
  distance?: number
  duration?: number
  ease?: any
  scaleFrom?: number
  blurFrom?: number
  delay: number
}): Record<ItemPreset, Variants> {
  return {
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration, ease, delay } } },
    fadeUp: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0, transition: { duration, ease, delay } },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0, transition: { duration, ease, delay } },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0, transition: { duration, ease, delay } },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0, transition: { duration, ease, delay } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: scaleFrom },
      visible: { opacity: 1, scale: 1, transition: { duration, ease, delay } },
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration, ease, delay } },
    },
    blurIn: {
      hidden: { opacity: 0, filter: `blur(${blurFrom}px)` },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration, ease, delay } },
    },
  }
}

export function StaggerItem({
  children,
  preset = 'fadeUp',
  i = 0,
  step = 0.06,
  baseDelay = 0,
  duration = 0.5,
  ease = 'easeOut',
  distance = 16,
  scaleFrom = 0.95,
  blurFrom = 6,
  once = true,
  amount = 0.2,
  className,
}: StaggerItemProps) {
  const delay = baseDelay + i * step
  const variants = React.useMemo(
    () => makeItemVariants({ distance, duration, ease, scaleFrom, blurFrom, delay })[preset],
    [distance, duration, ease, scaleFrom, blurFrom, delay, preset],
  )

  return (
    <motion.div
      className={cn(className)}
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  )
}
