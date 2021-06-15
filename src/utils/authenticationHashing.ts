import sha256 from 'crypto-js/sha256';
import Base64 from 'crypto-js/enc-base64';

/**
 * SHA256 Hashing.
 *
 * @param  {String} [salt=''] salt.
 * @param  {String} [challenge=''] challenge.
 * @param  {String} msg Message to encode.
 * @return {String} sha256 encoded string.
 */
export default function(salt: string, challenge: string, msg: string): string {
  const hash = Base64.stringify(sha256(msg + salt));

  return Base64.stringify(sha256(hash + challenge));
}
