import { config } from 'dotenv';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { clearTestData } from '../../utils/prisma';

// Load environment variables before anything else
const envPath = path.resolve(__dirname, '../../../.env.test');
console.log('Loading .env.test from:', envPath);

const result = config({ path: envPath });

if (result.error) {
  throw new Error(`Failed to load .env.test file: ${result.error}`);
}

import { existsSync, readFileSync } from 'fs';
import { execSync } from 'child_process';

// Verify file contents
if (existsSync(envPath)) {
  console.log('.env.test contents:', readFileSync(envPath, 'utf8'));
} else {
  throw new Error(`.env.test file not found at ${envPath}`);
}

export default async function globalSetup() {
  // Set test environment
  process.env.NODE_ENV = 'test';

  // Debugging: Log environment variables
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
  });

  // Set DATABASE_URL explicitly
  process.env.DATABASE_URL = 'file:./test.db';
  console.log('Explicitly set DATABASE_URL:', process.env.DATABASE_URL);

  try {
    // Create Prisma client with explicit DATABASE_URL
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'file:./test.db'
        }
      }
    });
    
    // Connect and run migrations
    await prisma.$connect();
    
    // Run migrations
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    // Enable foreign key support for SQLite
    await prisma.$executeRaw`PRAGMA foreign_keys = ON`;
    
    // Clear test data
    await clearTestData();
    await prisma.$disconnect();
  } catch (error) {
    console.error('Global setup failed:', error);
    throw error;
  }
}
