'use client'

import { motion, type Variants } from 'framer-motion'
import * as React from 'react'

type Preset = 'fade' | 'fadeUp' | 'fadeDown' | 'fadeLeft' | 'fadeRight' | 'scaleIn' | 'zoomIn' | 'blurIn' | 'stagger'

type PresetOptions = {
  duration?: number
  delay?: number
  ease?: any
  distance?: number
  scaleFrom?: number
  blurFrom?: number
  staggerChildren?: number
  delayChildren?: number
}

type AnimateInViewProps = PresetOptions & {
  children: React.ReactNode
  variant?: Preset
  once?: boolean
  amount?: number | 'some' | 'all'
  delay?: number
  className?: string
  initial?: 'hidden' | 'visible'
  animate?: 'hidden' | 'visible'
}

function makePresets(opts: PresetOptions): Record<Preset, Variants> {
  const {
    distance = 16,
    duration = 0.5,
    delay = 0,
    ease = 'easeOut',
    scaleFrom = 0.95,
    blurFrom = 6,
    staggerChildren,
    delayChildren,
  } = opts

  return {
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration, delay, ease } } },
    fadeUp: {
      hidden: { opacity: 0, y: distance },
      visible: { opacity: 1, y: 0, transition: { duration, delay, ease } },
    },
    fadeDown: {
      hidden: { opacity: 0, y: -distance },
      visible: { opacity: 1, y: 0, transition: { duration, delay, ease } },
    },
    fadeLeft: {
      hidden: { opacity: 0, x: distance },
      visible: { opacity: 1, x: 0, transition: { duration, delay, ease } },
    },
    fadeRight: {
      hidden: { opacity: 0, x: -distance },
      visible: { opacity: 1, x: 0, transition: { duration, delay, ease } },
    },
    scaleIn: {
      hidden: { opacity: 0, scale: scaleFrom },
      visible: { opacity: 1, scale: 1, transition: { duration, delay, ease } },
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.9 },
      visible: { opacity: 1, scale: 1, transition: { duration, delay, ease } },
    },
    blurIn: {
      hidden: { opacity: 0, filter: `blur(${blurFrom}px)` },
      visible: { opacity: 1, filter: 'blur(0px)', transition: { duration, delay, ease } },
    },
    stagger: {
      hidden: { opacity: 1 },
      visible: {
        opacity: 1,
        transition: { staggerChildren: staggerChildren ?? 0.08, delayChildren: delayChildren ?? delay },
      },
    },
  }
}

export function AnimateInView({
  children,
  variant = 'fadeUp',
  once = true,
  amount = 0.5,
  initial = 'hidden',
  animate = 'visible',
  className,
  ...opts
}: AnimateInViewProps) {
  const variants = React.useMemo(() => makePresets(opts)[variant], [variant, opts])

  return (
    <motion.div
      className={className}
      variants={variants}
      initial={initial}
      whileInView={animate}
      viewport={{ once, amount }}
    >
      {children}
    </motion.div>
  )
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
}
