import { Heading } from '@/app/(marketing)/_components/heading'
import { Container } from '@/components/shared/container'
import { IconContainer } from '@/components/shared/icon-container'
import { LuPlugZap } from 'react-icons/lu'
import {
  SiDiscord,
  SiGithub,
  SiRoblox,
  SiSoundcloud,
  SiSpotify,
  SiSteam,
  SiTwitch,
  SiValorant,
  SiYoutube,
} from 'react-icons/si'

const integrations = [
  {
    icon: <SiSpotify className="size-6 text-green-400" />,
  },
  {
    icon: <SiDiscord className="size-6 text-indigo-400" />,
  },
  {
    icon: <SiRoblox className="size-6 text-white" />,
  },
  {
    icon: <SiSoundcloud className="size-6 text-orange-400" />,
  },
  {
    icon: <SiSteam className="size-6 text-blue-400" />,
  },
  {
    icon: <SiTwitch className="size-6 text-purple-500" />,
  },
  {
    icon: <SiYoutube className="size-6 text-red-500" />,
  },
  {
    icon: <SiGithub className="size-6 text-gray-200" />,
  },
  {
    icon: <SiValorant className="size-6 text-red-400" />,
  },
]

export function Integrations() {
  return (
    <Container
      as="section"
      id="integrations"
      className="md:32 flex w-full flex-col items-center justify-center gap-8 py-24 lg:flex-row lg:justify-between"
    >
      <div className="flex flex-col items-center space-y-4 text-center lg:max-w-lg lg:items-start lg:text-left">
        <div className="text-primary-200 flex items-center gap-x-4">
          <div className="group text-evict-primary relative w-fit rounded-2xl border border-white/[0.03] bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),_0_1px_3px_rgba(0,0,0,0.3),_inset_0_-1px_1px_rgba(0,0,0,0.2)] transition-all duration-500 before:absolute before:inset-0 before:-z-10 before:rounded-2xl before:bg-gradient-to-b before:from-white/[0.02] before:to-transparent before:opacity-0 before:transition-opacity after:absolute after:inset-0 after:z-[-1] after:rounded-2xl after:bg-gradient-to-t after:from-black/30 after:to-transparent">
            <LuPlugZap className="text-primary-300 h-6 w-6" />
          </div>
          Widget Integrations
        </div>
        <Heading level={3} className="text-2xl font-bold lg:text-3xl">
          <span className="inline-block bg-linear-to-b from-[#ffaec6] from-0% via-white via-50% to-[#ffdfb6] to-100% bg-clip-text text-transparent">
            Integrate
          </span>{' '}
          your{' '}
          <span className="inline-block bg-linear-to-r from-[#b9ffc8] from-0% via-white via-55% to-[#8d98ff] to-100% bg-clip-text pr-px text-transparent">
            favorite platforms
          </span>
        </Heading>
        <p>Integrate your favorite platforms directly on your profile to enhance your online presence.</p>
      </div>
      <div className="grid w-fit grid-cols-5 grid-rows-2 gap-4">
        {integrations.map((item, idx) => (
          <div key={idx} className="transition-transform duration-300 hover:scale-110">
            <IconContainer size="2xl">{item.icon}</IconContainer>
          </div>
        ))}
      </div>
    </Container>
  )
}
