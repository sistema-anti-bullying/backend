import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const BULLYING_TYPES = [
  "Bullying Verbal",
  "Bullying Físico",
  "Bullying Psicológico",
  "Ciberbullying",
  "Exclusão Social",
  "Assédio",
  "Outro"
]

export function generateProtocol() {
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8).toUpperCase()
  return `DEN-${timestamp}-${random}`
}
