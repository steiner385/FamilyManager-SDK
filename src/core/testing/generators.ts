import { randomBytes } from 'crypto';

export function generateId(length = 16): string {
  return randomBytes(length).toString('hex');
}

export function generateRandomEmail(): string {
  return `test_${Date.now()}_${generateId(8)}@example.com`;
}

export function generateRandomString(length = 8): string {
  return generateId(length);
}

export function generateRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function generateRandomArray<T>(generator: () => T, length = 5): T[] {
  return Array.from({ length }, generator);
}

export function pickRandom<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}
