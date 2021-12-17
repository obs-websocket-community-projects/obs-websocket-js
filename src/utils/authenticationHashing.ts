import sha256 from 'crypto-js/sha256.js';
import Base64 from 'crypto-js/enc-base64.js';

/**
 * SHA256 Hashing.
 *
 * @param  {string} [salt=''] salt.
 * @param  {string} [challenge=''] challenge.
 * @param  {string} msg Message to encode.
 * @returns {string} sha256 encoded string.
 */
export default function (salt: string, challenge: string, msg: string): string {
	const hash = Base64.stringify(sha256(msg + salt))!;

	return Base64.stringify(sha256(hash + challenge))!;
}
