import crypto from 'crypto';

// Use process.env.DB_ENCRYPTION_KEY or a secure fallback derived key
const ENCRYPTION_KEY_STR = process.env.DB_ENCRYPTION_KEY || 'fizik-yildizi-super-secret-key-32bytes-long-123456';

// Derive a 32-byte key from our string key using sha256
const ENCRYPTION_KEY = crypto.createHash('sha256').update(ENCRYPTION_KEY_STR).digest();

const IV_LENGTH = 12; // GCM standard IV length
const AUTH_TAG_LENGTH = 16; // GCM standard tag length

/**
 * Encrypts cleartext using AES-256-GCM.
 * Returns payload in format: iv:authTag:encryptedText
 */
export function encrypt(text: string): string {
  if (!text) return '';
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    const authTag = cipher.getAuthTag();
    
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
  } catch (e) {
    console.error('Encryption error:', e);
    return text;
  }
}

/**
 * Decrypts a payload in format iv:authTag:encryptedText using AES-256-GCM.
 * Gracefully falls back to raw text if not encrypted.
 */
export function decrypt(encryptedText: string): string {
  if (!encryptedText) return '';
  try {
    const parts = encryptedText.split(':');
    if (parts.length !== 3) {
      // Not encrypted or legacy cleartext
      return encryptedText;
    }
    
    const iv = Buffer.from(parts[0], 'hex');
    const authTag = Buffer.from(parts[1], 'hex');
    const encrypted = parts[2];
    
    const decipher = crypto.createDecipheriv('aes-256-gcm', ENCRYPTION_KEY, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  } catch (e) {
    // Return original text if decryption fails (e.g. format mismatch)
    return encryptedText;
  }
}

/**
 * Secures a password using salted SHA-256 hashing.
 */
export function hashPassword(password: string, email: string = 'demo'): string {
  if (!password) return '';
  const salt = crypto.createHash('sha256').update(email.toLowerCase().trim()).digest('hex');
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}
