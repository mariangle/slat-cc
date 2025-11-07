import { RpsChoice, RpsPayload, RpsResult } from '@/lib/casino/games/rock-paper-scissors/schemas'
import { GameId, WithTransactionId } from '@/lib/casino/types'
import { adjustCoinsTx } from '@/lib/casino/wallet/write'
import { db } from '@/lib/drizzle'
import { recordWalletTransaction } from '../../wallet/record'

export async function handleRps({ input, user }: RpsPayload): Promise<WithTransactionId<RpsResult>> {
  const { betAmount, playerChoice } = input

  return db.transaction(async (tx) => {
    const computerChoice = generateComputerChoice()
    const outcome = determineRpsOutcome(playerChoice, computerChoice)

    const multiplier = outcome === 'win' ? 2 : outcome === 'draw' ? 1 : 0
    const grossPayout = betAmount * multiplier
    const delta = grossPayout - betAmount // +bet, 0, or -bet

    const newBalance = await adjustCoinsTx(tx, { userId: user.id, delta })

    const result = {
      delta,
      betAmount,
      grossPayout,
      outcome,
      newBalance,
      meta: {
        playerPick: playerChoice,
        computerPick: computerChoice,
      },
    } satisfies RpsResult

    const walletTransactionId = await recordWalletTransaction(tx, GameId.RockPaperScissors, user.id, result)

    return { ...result, walletTransactionId }
  })
}

function generateComputerChoice(): RpsChoice {
  const rpsChoices: RpsChoice[] = ['rock', 'paper', 'scissors']
  return rpsChoices[Math.floor(Math.random() * rpsChoices.length)]
}

function determineRpsOutcome(playerChoice: RpsChoice, computerChoice: RpsChoice): 'win' | 'lose' | 'draw' {
  if (playerChoice === computerChoice) return 'draw'

  const rpsOutcomes: Record<RpsChoice, RpsChoice> = {
    rock: 'scissors',
    paper: 'rock',
    scissors: 'paper',
  }

  return rpsOutcomes[playerChoice] === computerChoice ? 'win' : 'lose'
}
