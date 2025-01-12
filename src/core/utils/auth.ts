import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { UserRole } from '../types/user-role';

const SECRET_KEY = process.env.JWT_SECRET || 'test-secret-key';

export interface TokenPayload {
  userId: string;
  role: UserRole;
  exp?: number;
}

let testTokenVerification: ((token: string) => TokenPayload | null) | null = null;

export function setTestTokenVerification(fn: (token: string) => TokenPayload | null): void {
  testTokenVerification = fn;
}

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, storedHash] = hashedPassword.split(':');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return storedHash === hash;
}

export function generateToken(payload: TokenPayload): string {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}

export function verifyToken(token: string): TokenPayload | null {
  if (testTokenVerification) {
    return testTokenVerification(token);
  }

  try {
    return jwt.verify(token, SECRET_KEY) as TokenPayload;
  } catch (error) {
    return null;
  }
}
