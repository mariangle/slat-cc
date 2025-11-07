import bcrypt from 'bcrypt'

export function isPasswordCorrect(password: string, hashedPassword: string): boolean {
  return bcrypt.compareSync(password, hashedPassword.replace('$2y$', '$2a$'))
}

export function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10)
}
