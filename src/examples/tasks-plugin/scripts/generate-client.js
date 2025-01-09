import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Path to the prisma schema
const schemaPath = join(__dirname, '../prisma/schema.prisma');

// Generate Prisma Client
console.log('Generating Prisma Client...');
try {
  execSync(`npx prisma generate --schema=${schemaPath}`, {
    stdio: 'inherit'
  });
  console.log('Prisma Client generated successfully');
} catch (error) {
  console.error('Error generating Prisma Client:', error);
  process.exit(1);
}
