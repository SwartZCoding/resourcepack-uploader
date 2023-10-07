import { createHash } from 'crypto';

export function generateSHA1Token(data: string): string {
  const sha1 = createHash('sha1');
  sha1.update(data);
  return sha1.digest('hex');
}
