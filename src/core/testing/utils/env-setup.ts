// Set required environment variables before any imports
process.env.NODE_ENV = 'test';
process.env.DATABASE_URL = 'file:./test.db';
process.env.JWT_SECRET = 'development-secret-key-change-in-production';
process.env.GOOGLE_CLIENT_ID = '1087567160555-u6h3pj861nfprpahsotfbmf7k68uecrm.apps.googleusercontent.com';
process.env.GOOGLE_CLIENT_SECRET = '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';
process.env.GOOGLE_REDIRECT_URI = 'http://localhost:3000/auth/google/callback';
process.env.ENCRYPTION_KEY = 'test-encryption-key-32chars-long!!test-key';
