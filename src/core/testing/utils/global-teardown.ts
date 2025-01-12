import { disconnectPrisma } from '../../utils/prisma';

export default async function globalTeardown() {
  try {
    // Close database connections
    await disconnectPrisma();

    // Give time for connections to fully close
    await new Promise(resolve => setTimeout(resolve, 100));

    // Force process to exit if there are any hanging connections
    process.exit(0);
  } catch (error) {
    console.error('Global teardown failed:', error);
    process.exit(1);
  }
}
