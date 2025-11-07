'use client'

import { useMounted } from '@/hooks/use-mounted'
import type { WheelSegment } from '@/lib/casino/games/spin-the-wheel/schemas'

interface SpinWheelProps {
  segments: WheelSegment[]
  degree: number
}

export const RouletteWheel: React.FC<SpinWheelProps> = ({ segments, degree }) => {
  const mounted = useMounted()

  if (!mounted) {
    return <SpinWheelWrapper />
  }

  if (segments.length !== 6) {
    throw new Error('Spin wheel must have exactly 6 segments')
  }

  return (
    <>
      <SpinWheelWrapper>
        <div
          className="relative h-full w-full"
          style={{
            transform: `rotate(${degree + 29}deg)`, // Adjust visual alignment
            transition: 'transform 1s cubic-bezier(0, 0.99, 0.44, 0.99)',
          }}
        >
          {segments.map((segment, index) => (
            <div
              key={index}
              className="segment"
              style={{
                transform: `rotate(${60 * index}deg)`,
                borderColor: `${segment.hex} transparent`,
                position: 'absolute',
                width: 0,
                height: 0,
                borderStyle: 'solid',
                borderWidth: '130px 75px 0',
                transformOrigin: '75px 129px',
                left: '50px',
                top: '-4px',
              }}
            />
          ))}
        </div>
      </SpinWheelWrapper>
    </>
  )
}

const SpinWheelWrapper: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <div className="relative mt-6 rounded-full border-2 border-neutral-100 bg-neutral-200 p-1 drop-shadow-[0px_0px_8px_rgba(255,255,255,0.5)]">
      <div className="absolute -top-1 left-1/2 z-10 -translate-x-1/2">
        <div className="h-0 w-0 border-t-50 border-r-8 border-l-8 border-t-neutral-200 border-r-transparent border-l-transparent drop-shadow-[0px_0px_5px_rgba(255,255,255,0.5)]" />
      </div>
      <div
        style={{
          width: '250px',
          height: '250px',
        }}
        className="relative overflow-hidden rounded-full border-2 border-neutral-300"
      >
        {children}

        <div className="absolute top-1/2 left-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white drop-shadow-[0px_0px_3px_rgba(255,255,255,0.5)]"></div>
        <div className="absolute top-1/2 left-1/2 z-10 grid size-[44px] -translate-x-1/2 -translate-y-1/2 place-content-center rounded-full border-2 border-neutral-200 bg-neutral-100"></div>
      </div>
    </div>
  )
}
