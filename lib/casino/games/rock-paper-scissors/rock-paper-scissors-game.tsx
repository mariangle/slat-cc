'use client'

import { GlassWrapper } from '@/app/casino/_components/casino-wrappers'
import { BetAmountInput } from '@/app/casino/_components/game-bet-amount-input'
import { Button } from '@/app/casino/_components/game-button'
import { GameNavbar } from '@/app/casino/_components/game-navbar'
import { GameWrapper } from '@/app/casino/_components/game-wrapper'
import { Icon } from '@/components/ui/icon'
import { useCasinoGame } from '@/hooks/use-casino-game'
import type { RpsChoice, RpsInput, RpsResult } from '@/lib/casino/games/rock-paper-scissors/schemas'
import { CasinoGameProps } from '@/lib/casino/types'
import { motion } from 'framer-motion'
import * as React from 'react'

const choices: Record<RpsChoice, string> = {
  rock: 'fluent-emoji-flat:rock',
  paper: 'fluent-emoji:roll-of-paper',
  scissors: 'emojione-v1:scissors',
}

export const RockPaperScissorsGame = ({ game, user }: CasinoGameProps) => {
  const [playerChoice, setPlayerChoice] = React.useState<RpsChoice | null>(null)
  const [computerChoice, setComputerChoice] = React.useState<RpsChoice | null>(null)

  const {
    history,
    outcome,
    balance,
    betAmount,
    message,
    loading,
    setBetAmount,
    play,
    setOutcome,
    pushHistory,
    setLoading,
    setBalance,
  } = useCasinoGame({
    user,
    game,
  })

  const submitRpsChoice = async (playerChoice: RpsChoice) => {
    setPlayerChoice(playerChoice)
    setComputerChoice(null)

    const response = await play<RpsResult>({ betAmount, playerChoice } satisfies RpsInput)

    if (!response) return

    const { newBalance, meta, outcome, delta } = response

    setTimeout(() => {
      setComputerChoice(meta.computerPick)
      setOutcome(outcome)
      setBalance(newBalance)
      setLoading(false)
      pushHistory(delta)
    }, 250)
  }

  return (
    <>
      <GameNavbar history={history} authenticated={!!user} balance={balance} />
      <GameWrapper game={game} outcome={outcome} message={message}>
        <GlassWrapper inset>
          <div className="flex justify-center gap-6 py-6">
            <div className="flex flex-col items-center gap-2">
              <p className="text-[8px] font-bold text-white">You</p>
              <motion.div
                initial={{ scale: 1 }}
                animate={playerChoice ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                transition={{ duration: 0.5 }}
                className="grid size-20 place-content-center rounded-2xl border border-white/5 bg-white/5 shadow-lg drop-shadow-[0px_0px_5px_rgba(255,255,255,0.5)]"
              >
                {playerChoice ? (
                  <Icon name={choices[playerChoice]} className="size-10" />
                ) : (
                  <span className="text-2xl">?</span>
                )}
              </motion.div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-[8px] font-bold text-white">Computer</p>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={loading ? { scale: [1, 1.25, 1], opacity: [1, 0.8, 1] } : { scale: 1 }}
                transition={loading ? { duration: 0.3, repeat: Infinity } : { duration: 0.2 }}
                className="grid size-20 place-content-center rounded-2xl border border-white/5 bg-white/5 shadow-lg drop-shadow-[0px_0px_5px_rgba(255,255,255,0.5)]"
              >
                {computerChoice ? (
                  <Icon name={choices[computerChoice]} className="size-10" />
                ) : (
                  <span className="text-2xl">?</span>
                )}
              </motion.div>
            </div>
          </div>
          <div className="w-full space-y-4">
            <BetAmountInput
              value={betAmount}
              onChange={setBetAmount}
              placeholder="Enter bet amount"
              disabled={loading}
            />
            <div className="flex w-full justify-center gap-4">
              {Object.entries(choices).map(([value, icon]) => (
                <motion.div
                  key={value}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex h-fit w-full flex-col items-center gap-2"
                >
                  <Button
                    disabled={loading}
                    spanClassname="bg-red-800 grid place-content-center"
                    className="w-full bg-red-900"
                    onClick={() => submitRpsChoice(value as RpsChoice)}
                  >
                    <Icon name={icon} className="size-8" />
                  </Button>
                  <span className="text-[8px] text-white capitalize">{value}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </GlassWrapper>
      </GameWrapper>
    </>
  )
}
