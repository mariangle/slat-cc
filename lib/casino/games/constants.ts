import { CasinoGame, GameId } from '@/lib/casino/types'

export const CASINO_GAMES: Record<GameId, CasinoGame> = {
  [GameId.DailyReward]: {
    id: GameId.DailyReward,
    name: 'Daily Reward',
    description: 'Pop the balloons to claim your daily reward! You can claim your reward once a day.',
    rules: 'Pop the balloons to claim your daily reward!',
    slug: 'daily-reward',
    icon: 'streamline-plump:balloon-solid',
    hue: 200,
    color: '#16A34A', // green
  },
  [GameId.DiceRoll]: {
    id: GameId.DiceRoll,
    name: 'Dice Roll',
    description: 'Test your luck! Guess if the result will be lower (1-3) or higher (4-6).',
    rules: 'Guess if the result will be lower (1-3) or higher (4-6).',
    slug: 'dice-roll',
    icon: 'streamline-flex:dice-5-solid',
    hue: 300,
    color: '#1E8DF7', // blue
  },
  [GameId.SpinTheWheel]: {
    id: GameId.SpinTheWheel,
    name: 'Spin the Wheel',
    description: 'Test your luck! Spin the wheel and win big!',
    rules: 'Guess on a color and spin the wheel. If the wheel lands on your color, you win!',
    slug: 'spin-the-wheel',
    icon: 'solar:wheel-outline',
    hue: 50,
    color: '#F59E0B', // yellow
  },
  [GameId.SlotMachine]: {
    id: GameId.SlotMachine,
    name: 'Slot Machine',
    description: 'Test your luck! Spin the reels and match symbols to win big!',
    rules: 'Match symbols to win!',
    slug: 'slot-machine',
    icon: 'game-icons:slot-machine',
    hue: 140,
    color: '#DAA508', // yellow
  },
  [GameId.RockPaperScissors]: {
    id: GameId.RockPaperScissors,
    name: 'Rock Paper Scissors',
    description: 'Test your luck! Choose rock, paper, or scissors and beat the computer!',
    rules: 'Choose your weapon and beat the computer!',
    slug: 'rock-paper-scissors',
    icon: 'ri:scissors-2-fill',
    hue: 100,
    color: '#F77C7C', // red
  },
  [GameId.RangeRoulette]: {
    id: GameId.RangeRoulette,
    name: 'Range Roulette',
    description: 'Test your luck! Place your bets on a number range and spin the wheel!',
    rules: 'Place your bets on a number range and spin the wheel!',
    slug: 'range-roulette',
    icon: 'emojione-monotone:pool-8-ball',
    hue: 350,
    color: '#4F46E5', // purple
  },
}

export const casinoGames = Object.values(CASINO_GAMES)
