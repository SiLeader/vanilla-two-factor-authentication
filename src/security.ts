import crypto from 'crypto';

export function generateSecureRandom(size: number): Uint8Array {
  const buffer = crypto.randomBytes(size);
  return Uint8Array.from(buffer);
}
