'use client'

import type { CasinoGameProps } from '@/lib/casino/types'
import * as React from 'react'

import { BetAmountInput } from '@/app/casino/_components/game-bet-amount-input'
import { Button } from '@/app/casino/_components/game-button'
import { GameNavbar } from '@/app/casino/_components/game-navbar'
import { GameWrapper } from '@/app/casino/_components/game-wrapper'
import { useCasinoGame } from '@/hooks/use-casino-game'
import { colorToMultiplier, wheelSegments } from '@/lib/casino/games/spin-the-wheel/constants'
import type { SpinTheWheelInput, SpinTheWheelResult, WheelColor } from '@/lib/casino/games/spin-the-wheel/schemas'
import { RouletteWheel } from './roulette-wheel'

export const SpinTheWheelGame = ({ game, user }: CasinoGameProps) => {
  const [spinDegree, setSpinDegree] = React.useState(0)

  const { balance, history, outcome, betAmount, message, loading, setBetAmount, play, handleCasinoResult } =
    useCasinoGame({
      user,
      game,
    })

  const spinWheel = async (guess: WheelColor) => {
    const result = await play<SpinTheWheelResult>({ betAmount, guess } satisfies SpinTheWheelInput)

    if (!result) return

    const finalDegree = calculateFinalDegree(spinDegree, result.meta.wheelIndex)

    setSpinDegree(finalDegree)

    await new Promise((resolve) => setTimeout(resolve, 1000)) // wheel spin duration

    handleCasinoResult(result)
  }

  const getSegmentMultiplier = (color: WheelColor): string => {
    return `${colorToMultiplier.get(color)}x`
  }

  return (
    <>
      <GameNavbar history={history} authenticated={!!user} balance={balance} />
      <GameWrapper game={game} outcome={outcome} message={message}>
        <div className="flex w-full flex-col items-center justify-center text-center">
          <RouletteWheel segments={wheelSegments} degree={spinDegree} />
          <div className="mt-4 w-full space-y-3 p-4">
            <BetAmountInput value={betAmount} onChange={setBetAmount} disabled={loading} />
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <Button
                  onClick={() => spinWheel('yellow')}
                  disabled={loading}
                  className="bg-yellow-600"
                  spanClassname="bg-yellow-500"
                >
                  Yellow {getSegmentMultiplier('yellow')}
                </Button>
                <Button
                  onClick={() => spinWheel('blue')}
                  disabled={loading}
                  className="bg-blue-600"
                  spanClassname="bg-blue-500"
                >
                  Blue {getSegmentMultiplier('blue')}
                </Button>
              </div>
              <Button
                onClick={() => spinWheel('green')}
                disabled={loading}
                className="bg-green-600"
                spanClassname="bg-green-500"
              >
                Green {getSegmentMultiplier('green')}
              </Button>
            </div>
          </div>
        </div>
      </GameWrapper>
    </>
  )
}

