import { sha256 as SHA256 } from 'sha.js';

/**
 * SHA256 Hashing.
 *
 * @param  {String} [salt=''] salt.
 * @param  {String} [challenge=''] challenge.
 * @param  {String} msg Message to encode.
 * @return {String} sha256 encoded string.
 */
export default function(salt: string, challenge: string, msg: string): string {
  const hash = new SHA256()
    .update(msg)
    .update(salt)
    .digest('base64');

  return new SHA256()
    .update(hash)
    .update(challenge)
    .digest('base64');
}
