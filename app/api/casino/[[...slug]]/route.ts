import { withCasinoUser } from '@/lib/api/middleware/user'
import { enforceRateLimit } from '@/lib/api/rate-limit/enforce-rate-limit'
import { CASINO_LIMITS } from '@/lib/api/rate-limit/limits'
import { parseRequestBody } from '@/lib/api/utils'
import { casinoGames } from '@/lib/casino/games/constants'
import { handleDailyReward } from '@/lib/casino/games/daily-reward/daily-reward'
import { DailyRewardPayload } from '@/lib/casino/games/daily-reward/schemas'
import { handleDiceRoll } from '@/lib/casino/games/dice-roll/dice-roll'
import { diceRollInputSchema, DiceRollPayload } from '@/lib/casino/games/dice-roll/schemas'
import { handleRangeRoulette } from '@/lib/casino/games/range-roulette/range-roulette'
import { rangeRouletteInputSchema, RangeRoulettePayload } from '@/lib/casino/games/range-roulette/schemas'
import { handleRps } from '@/lib/casino/games/rock-paper-scissors/rock-paper-scissors'
import { rpsInputSchema, RpsPayload } from '@/lib/casino/games/rock-paper-scissors/schemas'
import { slotMachineInputSchema, SlotMachinePayload } from '@/lib/casino/games/slot-machine/schemas'
import { handleSlotMachine } from '@/lib/casino/games/slot-machine/slot-machine'
import { spinTheWheelInputSchema, SpinTheWheelPayload } from '@/lib/casino/games/spin-the-wheel/schemas'
import { handleSpinTheWheel } from '@/lib/casino/games/spin-the-wheel/spin-the-wheel'
import { notifyCasinoGameWebhook } from '@/lib/casino/webhook'
import { FedsServerError } from '@/lib/server/errors'
import { isUndefined } from 'lodash'
import { after, NextResponse } from 'next/server'
import { match } from 'ts-pattern'
import * as z from 'zod'

export const dynamic = 'force-dynamic'

/** POST /api/casino/:slug - Handles various casino game actions based on the slug */
export const POST = withCasinoUser()(async ({ user, params, req }) => {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    throw new FedsServerError({
      code: 'bad_request',
      message: 'Invalid slug provided.',
    })
  }

  const game = casinoGames.find((g) => g.slug === slug[0])

  if (!game) {
    throw new FedsServerError({
      code: 'not_found',
      message: 'Game not found.',
    })
  }

  if (process.env.CASINO_ENABLED !== 'true') {
    throw new FedsServerError({
      code: 'service_unavailable',
      message: 'Casino services are currently disabled. Please try again later.',
    })
  }

  let data: unknown

  try {
    data = await parseRequestBody(req)
  } catch (error) {
    // daily reward doesn't require a body
  }

  const headers = await enforceRateLimit(user.id, {
    namespace: 'casino',
    source: `uid:${user.id}`,
    limits: CASINO_LIMITS,
  })

  const result = await match(game.slug)
    .with('daily-reward', async () => {
      const payload: DailyRewardPayload = { user }

      return await handleDailyReward(payload)
    })
    .with('dice-roll', async () => {
      const input = handleInputValidation(diceRollInputSchema, data, user.coins)
      const mergedPayload: DiceRollPayload = { input, user }

      return await handleDiceRoll(mergedPayload)
    })
    .with('spin-the-wheel', async () => {
      const input = handleInputValidation(spinTheWheelInputSchema, data, user.coins)
      const mergedPayload: SpinTheWheelPayload = { input, user }

      return await handleSpinTheWheel(mergedPayload)
    })
    .with('slot-machine', async () => {
      const input = handleInputValidation(slotMachineInputSchema, data, user.coins)
      const mergedPayload: SlotMachinePayload = { input, user }

      return await handleSlotMachine(mergedPayload)
    })
    .with('rock-paper-scissors', async () => {
      const input = handleInputValidation(rpsInputSchema, data, user.coins)
      const mergedPayload: RpsPayload = { input, user }

      return await handleRps(mergedPayload)
    })
    .with('range-roulette', async () => {
      const input = handleInputValidation(rangeRouletteInputSchema, data, user.coins)
      const mergedPayload: RangeRoulettePayload = { input, user }

      return await handleRangeRoulette(mergedPayload)
    })
    .exhaustive()

  after(async () => {
    await notifyCasinoGameWebhook({
      walletTransactionId: result.walletTransactionId,
      gameId: game.id,
      oldBalance: user.coins,
      newBalance: result.newBalance,
      betAmount: result.betAmount,
      delta: result.delta,
      actor: user,
      meta: result.meta,
    })
  })

  return NextResponse.json(result, {
    headers: Object.fromEntries(headers.entries()),
  })
})

function handleInputValidation<T extends z.ZodObject<any>>(schema: T, data: unknown, balance?: number): z.infer<T> {
  const parsed = schema.parse(data)

  if ('betAmount' in parsed && !isUndefined(balance)) {
    validateBetOrThrow(parsed.betAmount, balance)
  }

  return parsed
}

function validateBetOrThrow(betAmount: number, balance: number) {
  if (betAmount <= 0) {
    throw new FedsServerError({
      message: 'Please enter a valid bet amount',
      code: 'bad_request',
    })
  }

  if (betAmount > balance) {
    throw new FedsServerError({
      message: "You don't have enough coins",
      code: 'bad_request',
    })
  }
}
