import { createCipheriv, createDecipheriv, randomBytes } from "crypto";
import { env } from "../env";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;

function getKey(): Buffer | null {
  if (!env.ENCRYPTION_KEY) return null;
  return Buffer.from(env.ENCRYPTION_KEY, "hex");
}

/**
 * Encrypt plaintext using AES-256-GCM.
 * Returns base64-encoded string: iv + ciphertext + authTag.
 * If ENCRYPTION_KEY is not set, returns the plaintext unchanged (graceful degradation).
 */
export function encrypt(plaintext: string): string {
  const key = getKey();
  if (!key) return plaintext;

  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const encrypted = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, encrypted, tag]).toString("base64");
}

/**
 * Decrypt a value encrypted by encrypt().
 * If ENCRYPTION_KEY is not set, returns the value unchanged.
 */
export function decrypt(ciphertext: string): string {
  const key = getKey();
  if (!key) return ciphertext;

  // If the value doesn't look like base64, it's probably unencrypted legacy data
  if (!/^[A-Za-z0-9+/=]+$/.test(ciphertext)) return ciphertext;

  try {
    const buf = Buffer.from(ciphertext, "base64");
    const iv = buf.subarray(0, IV_LENGTH);
    const tag = buf.subarray(buf.length - TAG_LENGTH);
    const encrypted = buf.subarray(IV_LENGTH, buf.length - TAG_LENGTH);

    const decipher = createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    return decipher.update(encrypted) + decipher.final("utf8");
  } catch {
    // If decryption fails, assume it's unencrypted legacy data
    return ciphertext;
  }
}

/**
 * Mask an account number, showing only the last 4 digits.
 * e.g. "12345678" -> "****5678"
 */
export function maskAccountNumber(accountNumber: string): string {
  if (accountNumber.length <= 4) return accountNumber;
  return "****" + accountNumber.slice(-4);
}
