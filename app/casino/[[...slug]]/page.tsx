import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { match } from 'ts-pattern'

import { GameInterface } from '@/app/casino/_components/game-interface'
import { DailyRewardGame } from '@/lib/casino/games/daily-reward/daily-reward-game'
import { DiceRollGame } from '@/lib/casino/games/dice-roll/dice-roll-game'
import { RangeRouletteGame } from '@/lib/casino/games/range-roulette/range-roulette-game'
import { RockPaperScissorsGame } from '@/lib/casino/games/rock-paper-scissors/rock-paper-scissors-game'
import { SlotMachineGame } from '@/lib/casino/games/slot-machine/slot-machine-game'
import { SpinTheWheelGame } from '@/lib/casino/games/spin-the-wheel/spin-the-wheel-game'

import CasinoLobby from '@/app/casino/_components/casino-lobby-page'
import { casinoGames } from '@/lib/casino/games/constants'
import { getDailyRewardStatus } from '@/lib/casino/games/daily-reward/queries/get-daily-reward-status'
import { getMultiplierData } from '@/lib/casino/games/daily-reward/queries/get-multiplier-status'
import { getCasinoUserById } from '@/lib/casino/queries/casino-user'
import type { CasinoGame, CasinoGameProps } from '@/lib/casino/types'
import { withSession } from '@/lib/server/guards'
import { constructMetadata } from '@/lib/utils'

interface Params {
  slug?: string[]
}

export async function generateMetadata(props: { params: Promise<Params> }): Promise<Metadata | undefined> {
  const { slug } = await props.params

  if (!slug || slug.length === 0)
    return constructMetadata({
      title: 'Lobby',
      description: 'Welcome to the casino lobby! Choose a game to play.',
    })

  const casinoGame = casinoGames.find((casinoGame) => casinoGame.slug === slug[0])

  if (!casinoGame) return

  return constructMetadata({
    title: casinoGame.name,
    description: casinoGame.description,
  })
}

function getGameComponent(game: CasinoGame): React.ComponentType<CasinoGameProps> {
  return match(game.slug)
    .returnType<React.ComponentType<CasinoGameProps>>()
    .with('daily-reward', () => DailyRewardGame)
    .with('dice-roll', () => DiceRollGame)
    .with('spin-the-wheel', () => SpinTheWheelGame)
    .with('slot-machine', () => SlotMachineGame)
    .with('rock-paper-scissors', () => RockPaperScissorsGame)
    .with('range-roulette', () => RangeRouletteGame)
    .exhaustive()
}

export default async function CasinoPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    return <CasinoLobby />
  }

  const casinoGame = casinoGames.find((casinoGame) => casinoGame.slug === slug[0])

  if (!casinoGame) {
    return notFound()
  }

  const data = await withSession(async (userId) => {
    const [casinoUser, dailyRewardStatus] = await Promise.all([getCasinoUserById(userId), getDailyRewardStatus(userId)])

    const multiplierData = await getMultiplierData(userId, dailyRewardStatus?.streakCount ?? 0)

    return { user: casinoUser, dailyRewardStatus, multiplierData }
  })

  const props: CasinoGameProps = {
    game: casinoGame,
    dailyRewardStatus: data?.dailyRewardStatus,
    user: data?.user,
    multiplierData: data?.multiplierData,
  }

  const GameComponent = getGameComponent(casinoGame)

  return <GameInterface game={casinoGame} component={<GameComponent {...props} />} />
}
