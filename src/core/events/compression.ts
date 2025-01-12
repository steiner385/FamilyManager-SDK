import { gzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';

const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);

interface CompressionConfig {
  compressionLevel: number;  // 1-9, where 1 is fastest and 9 is best compression
  threshold: number;         // Minimum size in bytes before compression is applied
}

export class EventCompressor {
  private config: CompressionConfig;

  constructor(config: CompressionConfig) {
    this.config = config;
  }

  private shouldCompress(data: unknown): boolean {
    const size = JSON.stringify(data).length;
    return size > this.config.threshold;
  }

  async compress<T>(data: T): Promise<string | T> {
    if (!data || !this.shouldCompress(data)) {
      return data;
    }

    try {
      const jsonString = JSON.stringify(data);
      const compressed = await gzipAsync(jsonString, {
        level: this.config.compressionLevel
      });
      return compressed.toString('base64');
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  async decompress<T>(data: string): Promise<T> {
    try {
      const buffer = Buffer.from(data, 'base64');
      const decompressed = await gunzipAsync(buffer);
      return JSON.parse(decompressed.toString());
    } catch (error) {
      console.error('Decompression failed:', error);
      throw error;
    }
  }
}
