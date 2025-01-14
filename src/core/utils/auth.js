import jwt from 'jsonwebtoken';
import crypto from 'crypto';
const SECRET_KEY = process.env.JWT_SECRET || 'test-secret-key';
let testTokenVerification = null;
export function setTestTokenVerification(fn) {
    testTokenVerification = fn;
}
export function hashPassword(password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return `${salt}:${hash}`;
}
export function verifyPassword(password, hashedPassword) {
    const [salt, storedHash] = hashedPassword.split(':');
    const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
    return storedHash === hash;
}
export function generateToken(payload) {
    return jwt.sign(payload, SECRET_KEY, { expiresIn: '24h' });
}
export function verifyToken(token) {
    if (testTokenVerification) {
        return testTokenVerification(token);
    }
    try {
        return jwt.verify(token, SECRET_KEY);
    }
    catch (error) {
        return null;
    }
}
//# sourceMappingURL=auth.js.map