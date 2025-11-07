import { JWTPayload, SignJWT, jwtVerify } from 'jose'

const encodedKey = new TextEncoder().encode(process.env.JWT_SECRET_KEY!)

export async function encrypt(payload: JWTPayload & { expiresAt: Date }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(Math.floor(payload.expiresAt.getTime() / 1000))
    .sign(encodedKey)
}

export async function decrypt(session = '') {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    return
  }
}
