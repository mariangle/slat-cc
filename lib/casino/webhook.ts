import { GameId } from '@/lib/casino/types'
import { Actor } from '@/lib/features/users/types'
import { formatNumber } from '@/lib/utils'
import { dataToJsonFields, DiscordWebhook, webhooks } from '@/lib/webhook'
import { match } from 'ts-pattern'

type CasinoGamePayload = {
  walletTransactionId: number
  gameId: GameId
  actor: Actor
  betAmount: number
  delta: number
  oldBalance: number
  newBalance: number
  meta: Record<string, unknown>
}

type CasinoGameDisplayInfo = {
  title: string
  color: number
}

function resolveGameId(gameId: GameId): CasinoGameDisplayInfo {
  return match(gameId)
    .with(GameId.DailyReward, () => ({
      title: 'Daily Reward 🎉',
      color: DiscordWebhook.colors.green,
    }))
    .with(GameId.DiceRoll, () => ({
      title: 'Dice Roll 🎲',
      color: DiscordWebhook.colors.blue,
    }))
    .with(GameId.SpinTheWheel, () => ({
      title: 'Spin the Wheel 🎡',
      color: DiscordWebhook.colors.yellow,
    }))
    .with(GameId.SlotMachine, () => ({
      title: 'Slot Machine 🎰',
      color: DiscordWebhook.colors.yellow,
    }))
    .with(GameId.RockPaperScissors, () => ({
      title: 'Rock Paper Scissors ✂️',
      color: DiscordWebhook.colors.red,
    }))
    .with(GameId.RangeRoulette, () => ({
      title: 'Range Roulette 🎱',
      color: DiscordWebhook.colors.purple,
    }))
    .otherwise(() => {
      throw new Error('Invalid game ID', { cause: gameId })
    })
}

function resolveDescription(payload: CasinoGamePayload): string {
  const { gameId, delta, actor, walletTransactionId } = payload

  const coins = `**${Math.abs(delta).toFixed(2)}** coins`
  const transactionTag = `*\`#${walletTransactionId}\`:*`
  const username = `**${actor.username}**`

  return match(gameId)
    .with(GameId.DailyReward, () => `${transactionTag} ${username} just claimed their daily reward of ${coins}!`)
    .otherwise(() => `${transactionTag} ${username} just ${delta > 0 ? `won ${coins}!` : `lost ${coins}.`}`)
}

export async function notifyCasinoGameWebhook(payload: CasinoGamePayload): Promise<void> {
  const { title, color } = resolveGameId(payload.gameId)
  const fields = dataToJsonFields(payload.meta)
  const description = resolveDescription(payload)

  await new DiscordWebhook(webhooks.casinoGame).send({
    title,
    description,
    url: DiscordWebhook.profileUrl(payload.actor.username),
    actor: payload.actor,
    ...(payload.delta > 0 && { color }),
    fields: [
      ...(payload.gameId !== GameId.DailyReward
        ? [
            {
              name: 'Bet Amount',
              value: payload.betAmount.toFixed(2),
              inline: false,
            },
          ]
        : []),
      {
        name: 'Balance',
        value: `Old: ${formatNumber(payload.oldBalance)}\n` + `New: ${formatNumber(payload.newBalance)}\n`,
        inline: false,
      },
      ...(fields || []),
    ],
  })
}
