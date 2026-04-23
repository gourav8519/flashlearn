import { createCipheriv, createDecipheriv, randomBytes, scryptSync } from 'crypto';

const SECRET = process.env.AUTH_SECRET;
if (!SECRET) {
  throw new Error('AUTH_SECRET must be set — used as the encryption key for secrets at rest');
}
const KEY = scryptSync(SECRET, 'flashlearn-enc-salt-v1', 32);
const PREFIX = 'enc:v1:';

export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', KEY, iv);
  const ct = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${PREFIX}${iv.toString('base64')}:${ct.toString('base64')}:${tag.toString('base64')}`;
}

export function decryptSecret(encoded: string): string {
  if (!encoded.startsWith(PREFIX)) return encoded;
  const [ivB64, ctB64, tagB64] = encoded.slice(PREFIX.length).split(':');
  const decipher = createDecipheriv('aes-256-gcm', KEY, Buffer.from(ivB64, 'base64'));
  decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
  const pt = Buffer.concat([
    decipher.update(Buffer.from(ctB64, 'base64')),
    decipher.final(),
  ]);
  return pt.toString('utf8');
}

export function maskSecret(plaintext: string): string {
  if (plaintext.length < 10) return '••••';
  return `${plaintext.slice(0, 4)}•••••${plaintext.slice(-4)}`;
}
