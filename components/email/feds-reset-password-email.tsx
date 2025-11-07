import { PASSWORD_RESET_TTL_MINUTES } from '@/lib/auth/password-reset/constants'
import { APP_CONFIG } from '@/lib/config'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Tailwind,
  Text,
} from '@react-email/components'
import * as React from 'react'
import type { FedsEmailProps } from './render-email-html'

export const FedsResetPasswordEmail: React.FC<FedsEmailProps> = ({ username, token }) => {
  return (
    <Html>
      <Head />
      <Preview>You have requested to reset your password. Click the button below to reset your password.</Preview>
      <Tailwind
        config={{
          theme: {
            extend: {
              spacing: {
                0: '0px',
                20: '20px',
                45: '45px',
              },
            },
          },
        }}
      >
        <Body className="font-sans text-base text-black">
          <Container className="bg-white p-45 text-black">
            <Img
              src="https://feds.lol/images/logo.png"
              width="250"
              height="250"
              alt="feds"
              className="mx-auto my-20 h-[160px] w-[140px] rounded-xl object-cover"
            />
            <Heading className="my-0 text-center leading-8">Reset Password</Heading>
            <Text className="text-center text-base">
              Hi <strong>{username}</strong>, we received a request to reset your password. Click the button below to
              reset your password. It expires in {PASSWORD_RESET_TTL_MINUTES} minutes.
            </Text>
            <Section className="w-full text-center">
              <Button
                href={`${APP_CONFIG.baseUrl}/reset-password?token=${token}`}
                className="bg-black px-[18px] py-3 text-white"
              >
                Reset Password
              </Button>
            </Section>
          </Container>
          <Container>
            <Text className="mx-auto mb-45 w-full text-center text-xs text-gray-400">
              If you didn&apos;t request a password reset, you can ignore this email. Need help?{' '}
              <Link href={APP_CONFIG.links.discord} className="text-blue-500 underline">
                Contact us
              </Link>
              ,
            </Text>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  )
}
