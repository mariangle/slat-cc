'use client'

import { Card } from '@/components/profile/card/card'
import { CardImage } from '@/components/profile/card/card-image'
import { PlayPauseButton, SkipBackButton, SkipForwardButton } from '@/components/profile/tracks/track-controls'
import { ProgressBar } from '@/components/profile/tracks/track-progress-bar'
import { useMusicPlayer, type MusicPlayer } from '@/hooks/use-music-player'
import type { MusicPlayerLayout } from '@/lib/features/app'
import type { Card as CardConfig } from '@/lib/features/config/schemas'
import type { Track } from '@/lib/features/tracks/schemas'
import { cn, isHexDark } from '@/lib/utils'
import { isNil } from 'lodash'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaDeezer } from 'react-icons/fa'
import { match } from 'ts-pattern'

type MusicPlayerSharedProps = {
  card: CardConfig
  colors: {
    text: string
    name: string
    theme: string
  }
  preview?: boolean
}

type MusicPlayerProps = MusicPlayerSharedProps & { player: MusicPlayer }

export function MusicPlayer({
  tracks,
  card,
  colors,
  layout,
  preview,
}: MusicPlayerSharedProps & {
  tracks: Track[]
  layout: MusicPlayerLayout
}) {
  const player = useMusicPlayer(tracks)

  const PlayerComponent = match(layout)
    .returnType<React.ComponentType<MusicPlayerProps>>()
    .with('default', () => DefaultMusicPlayer)
    .with('compact', () => CompactMusicPlayer)
    .with('banner', () => BannerMusicPlayer)
    .with('vinyl', () => VinylMusicPlayer)
    .with('cover-vinyl', () => CoverVinylMusicPlayer)
    .exhaustive()

  return (
    <>
      {player.currentUrl && (
        <audio ref={player.audioRef} className="hidden" src={player.currentUrl} autoPlay={player.isPlaying} />
      )}
      <PlayerComponent colors={colors} player={player} card={card} preview={preview} />
    </>
  )
}

const DefaultMusicPlayer = ({ card, colors, player }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="relative flex w-full flex-col items-center gap-2 p-4 pt-8"
      style={{
        color: colors.text,
      }}
    >
      {player.currentTrack.deezerTrackId && (
        <Link
          href={`https://www.deezer.com/track/${player.currentTrack.deezerTrackId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute top-4 right-4"
        >
          <FaDeezer />
        </Link>
      )}
      <CardImage
        src={player.currentTrack.cover}
        alt={player.currentTrack.title}
        borderRadius={card.borderRadius}
        card={card}
        className="size-20"
      />
      <div className="mx-auto flex w-full max-w-lg flex-col items-center justify-center gap-1">
        <div className="overflow-hidden text-center">
          <div
            className="line-clamp-1 text-base font-semibold hover:underline"
            style={{
              color: colors.name,
            }}
          >
            {player.currentTrack.title}
          </div>
          <p className="line-clamp-1 text-sm">{player.currentTrack.artist}</p>
        </div>
        <ProgressBar
          themeColor={colors.theme}
          duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
          progress={player.progress}
        />
        <div className="flex items-center justify-center gap-x-3">
          <SkipBackButton onClick={player.prevTrack} className="size-3.5" disabled={player.length === 1} />
          <PlayPauseButton
            onClick={player.toggleAudio}
            playing={player.isPlaying}
            className="size-[20px]"
            disabled={!player.currentUrl}
          />
          <SkipForwardButton onClick={player.nextTrack} className="size-3.5" disabled={player.length === 1} />
        </div>
      </div>
    </Card>
  )
}

const CompactMusicPlayer = ({ colors, card, player }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="relative flex w-full items-center gap-3 p-3"
      style={{
        color: colors.text,
      }}
    >
      <CardImage
        src={player.currentTrack.cover}
        alt={player.currentTrack.title}
        borderRadius={card.borderRadius}
        card={card}
        className="size-20"
      />
      <div className="mx-auto flex w-full flex-col items-center justify-center gap-1">
        <div className="w-full overflow-hidden">
          <div className="flex items-center justify-between">
            <div
              className="line-clamp-1 text-base font-semibold hover:underline"
              style={{
                color: colors.name,
              }}
            >
              {player.currentTrack.title}
            </div>
            {player.currentTrack.deezerTrackId && <FaDeezer />}
          </div>
          <p className="line-clamp-1 text-sm">{player.currentTrack.artist}</p>
        </div>
        <div className="mt-1.5 flex w-full items-center justify-center gap-x-3">
          <ProgressBar
            themeColor={colors.theme}
            duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
            progress={player.progress}
          />
          <div className="flex items-center justify-center gap-x-3">
            <SkipBackButton onClick={player.prevTrack} className="size-3" disabled={player.length === 1} />
            <PlayPauseButton
              onClick={player.toggleAudio}
              playing={player.isPlaying}
              className="size-[16px]"
              disabled={!player.currentUrl}
            />
            <SkipForwardButton onClick={player.nextTrack} className="size-3" disabled={player.length === 1} />
          </div>
        </div>
      </div>
    </Card>
  )
}

const BannerMusicPlayer = ({ card, player, colors }: MusicPlayerProps) => {
  return (
    <Card
      card={card}
      className="flex w-full flex-col items-center overflow-hidden p-0"
      style={{
        color: colors.text,
      }}
    >
      <div
        className="relative w-full bg-white/5 p-4"
        style={{
          backgroundColor: card.backgroundColor,
        }}
      >
        <div className="relative flex w-full items-end gap-4">
          <CardImage
            src={player.currentTrack.cover}
            alt={player.currentTrack.title}
            card={card}
            borderRadius={card.borderRadius}
            className="size-20"
          />
          <div className="flex w-full flex-col items-start gap-3 overflow-hidden">
            <div className="w-full">
              <div className="flex items-center justify-between gap-2">
                <h5
                  className="line-clamp-1 text-base font-semibold hover:underline"
                  style={{
                    color: isHexDark(card.backgroundColor) ? '#fff' : '#000',
                  }}
                >
                  {player.currentTrack.title}
                </h5>
                {player.currentTrack.deezerTrackId && <FaDeezer className="shrink-0" />}
              </div>
              <p
                className="line-clamp-1 text-sm"
                style={{
                  color: isHexDark(card.backgroundColor) ? '#fff' : '#000',
                }}
              >
                {player.currentTrack.artist}
              </p>
            </div>
            <div className="flex items-center justify-center gap-x-4">
              <SkipBackButton onClick={player.prevTrack} className="size-3" disabled={player.length === 1} />
              <PlayPauseButton
                onClick={player.toggleAudio}
                playing={player.isPlaying}
                className="size-4"
                disabled={!player.currentUrl}
              />
              <SkipForwardButton onClick={player.nextTrack} className="size-3" disabled={player.length === 1} />
            </div>
          </div>
        </div>
      </div>
      <div className="w-full p-4">
        <ProgressBar
          themeColor={colors.theme}
          duration={player.currentTrack.deezerTrackId ? 29 : player.currentTrack.duration}
          progress={player.progress}
          column
        />
      </div>
    </Card>
  )
}

const VinylMusicPlayer = ({ colors, card, player }: MusicPlayerProps) => {
  const [rotation, setRotation] = React.useState(0)
  const requestRef = React.useRef<number>()
  const lastTimeRef = React.useRef<number>()
  const isPlaying = player.isPlaying && player.currentUrl

  const animate = React.useCallback((time: number) => {
    if (!isNil(lastTimeRef.current)) {
      const delta = time - lastTimeRef.current
      const degreesPerMs = 360 / 10_000 // 360 degrees every 10s
      setRotation((prev) => (prev + delta * degreesPerMs) % 360)
    }
    lastTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  React.useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      lastTimeRef.current = undefined
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [animate, isPlaying])

  return (
    <Card
      card={card}
      className="flex w-full flex-row items-center justify-between gap-4 gap-x-12 p-4"
      style={{
        color: colors.text,
      }}
    >
      <div className="drop-shadow-[0px_0px_20px_rgba(0,0,0,0.25)]">
        <div
          className="relative flex size-24 items-center justify-center overflow-hidden rounded-full"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isPlaying ? 'none' : 'transform 0.3s ease',
          }}
        >
          <Image
            unoptimized
            src={player.currentTrack.cover}
            alt={player.currentTrack.title}
            width={100}
            height={100}
            className="relative z-10 size-16 rounded-full border border-[#111111] bg-[#000000] object-cover p-1 shadow-xl"
          />
          <Image
            unoptimized
            src="/images/vinyl.png"
            alt={player.currentTrack.title}
            width={100}
            height={100}
            className="absolute inset-0 h-full w-full object-cover brightness-[0.5]"
          />
        </div>
      </div>
      <div className="flex w-full justify-between gap-4">
        <div>
          <div
            className="line-clamp-1 text-base font-semibold hover:underline sm:text-xl"
            style={{ color: colors.name }}
          >
            {player.currentTrack.title}
          </div>
          <p className="line-clamp-1 text-sm">{player.currentTrack.artist}</p>
        </div>
        <div className="flex items-center justify-end gap-x-3 pr-3">
          <SkipBackButton onClick={player.prevTrack} className="size-4" disabled={player.length === 1} />
          <PlayPauseButton
            onClick={player.toggleAudio}
            playing={player.isPlaying}
            className="size-5"
            disabled={!player.currentUrl}
          />
          <SkipForwardButton onClick={player.nextTrack} className="size-4" disabled={player.length === 1} />
        </div>
      </div>
    </Card>
  )
}

const CoverVinylMusicPlayer = ({ player, preview }: MusicPlayerProps) => {
  const [rotation, setRotation] = React.useState(0)
  const requestRef = React.useRef<number>()
  const lastTimeRef = React.useRef<number>()
  const isPlaying = player.isPlaying && player.currentUrl

  const animate = React.useCallback((time: number) => {
    if (!isNil(lastTimeRef.current)) {
      const delta = time - lastTimeRef.current
      const degreesPerMs = 360 / 10_000 // 360 degrees every 10s
      setRotation((prev) => (prev + delta * degreesPerMs) % 360)
    }
    lastTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }, [])

  React.useEffect(() => {
    if (isPlaying) {
      requestRef.current = requestAnimationFrame(animate)
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      lastTimeRef.current = undefined
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
    }
  }, [animate, isPlaying])

  return (
    <div className={cn('relative w-fit', !preview && 'fixed bottom-0 left-4 z-20')}>
      <div className="relative z-10 flex size-16 flex-col items-start justify-between overflow-hidden rounded-xl p-1.5">
        <Image
          unoptimized
          src={player.currentTrack.cover}
          alt={player.currentTrack.title}
          width={100}
          height={100}
          className="absolute inset-0"
        />
        <PlayPauseButton
          onClick={player.toggleAudio}
          playing={player.isPlaying}
          className="relative size-2.5"
          disabled={!player.currentUrl}
        />
        <div className="relative z-10">
          <div className="line-clamp-1 text-xs text-white">{player.currentTrack.title}</div>
          <p className="line-clamp-1 text-[10px] text-neutral-400">{player.currentTrack.artist}</p>
        </div>
      </div>
      <div
        className="absolute top-1/2 right-0 flex size-14 translate-x-1/2 -translate-y-1/2 items-center justify-center overflow-hidden rounded-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isPlaying ? 'none' : 'transform 0.3s ease',
        }}
      >
        <Image
          unoptimized
          src={player.currentTrack.cover}
          alt={player.currentTrack.title}
          width={100}
          height={100}
          className="relative z-10 size-8 rounded-full border border-[#111111] bg-[#000000] object-cover p-1 shadow-xl"
        />
        <Image
          unoptimized
          src="/images/vinyl.png"
          alt={player.currentTrack.title}
          width={100}
          height={100}
          className="absolute inset-0 h-full w-full object-cover brightness-[0.5]"
        />
      </div>
    </div>
  )
}
