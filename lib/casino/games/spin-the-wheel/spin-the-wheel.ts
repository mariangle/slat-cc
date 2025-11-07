import { wheelSegments } from '@/lib/casino/games/spin-the-wheel/constants'
import { SpinTheWheelPayload, SpinTheWheelResult } from '@/lib/casino/games/spin-the-wheel/schemas'
import { GameId, WithTransactionId } from '@/lib/casino/types'
import { recordWalletTransaction } from '@/lib/casino/wallet/record'
import { adjustCoinsTx } from '@/lib/casino/wallet/write'
import { db } from '@/lib/drizzle'

export async function handleSpinTheWheel({
  input,
  user,
}: SpinTheWheelPayload): Promise<WithTransactionId<SpinTheWheelResult>> {
  const { guess, betAmount } = input

  return db.transaction(async (tx) => {
    const wheelIndex = Math.floor(Math.random() * wheelSegments.length)
    const landedWheelSegment = wheelSegments[wheelIndex]
    const win = landedWheelSegment.color === guess
    const multiplier = landedWheelSegment.multiplier

    const grossPayout = win ? betAmount * multiplier : 0
    const delta = grossPayout - betAmount

    const newBalance = await adjustCoinsTx(tx, { userId: user.id, delta })

    const result = {
      newBalance,
      betAmount,
      outcome: win ? 'win' : 'lose',
      meta: {
        guess,
        multiplier,
        betAmount,
        wheelIndex,
        wheelResult: landedWheelSegment.color,
      },
      delta,
      grossPayout,
    } satisfies SpinTheWheelResult

    const walletTransactionId = await recordWalletTransaction(tx, GameId.SpinTheWheel, user.id, result)

    return { ...result, walletTransactionId }
  })
}
