import { v4 as uuidv4 } from 'uuid'

export function generateId(): string {
  return uuidv4()
}

export function getExpirationDate(hours: number = 24): string {
  const date = new Date()
  date.setHours(date.getHours() + hours)
  return date.toISOString()
}

export function isExpired(expiresAt: string): boolean {
  return new Date(expiresAt) < new Date()
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

