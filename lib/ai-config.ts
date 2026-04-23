import { decryptSecret } from './crypto';

const ENV_KEY =
  process.env.GROQ_API_KEY && process.env.GROQ_API_KEY !== 'placeholder'
    ? process.env.GROQ_API_KEY
    : null;

export function resolveGroqKey(userKey?: string | null): string | null {
  if (userKey && userKey.trim()) {
    try {
      return decryptSecret(userKey.trim());
    } catch {
      return null;
    }
  }
  return ENV_KEY;
}

export function aiAvailable(userKey?: string | null): boolean {
  return resolveGroqKey(userKey) !== null;
}
