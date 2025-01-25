import * as pako from 'pako';

export interface CompressionConfig {
  threshold: number;
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export class EventCompressor {
  private config: CompressionConfig;

  constructor(config: CompressionConfig) {
    this.config = {
      compressionLevel: 6,
      ...config
    };
  }

  private shouldCompress(data: unknown): boolean {
    const size = JSON.stringify(data).length;
    return size > this.config.threshold;
  }

  async compress(data: unknown): Promise<unknown> {
    if (!data || !this.shouldCompress(data)) {
      return data;
    }

    try {
      const jsonString = JSON.stringify(data);
      const uint8Array = Buffer.from(jsonString, 'utf-8');
      
      const compressed = pako.deflate(uint8Array, {
        level: this.config.compressionLevel
      });
      
      // Convert to base64 for safe transmission
      return Buffer.from(compressed).toString('base64');
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  async decompress(data: string): Promise<unknown> {
    try {
      // Convert from base64 to Buffer
      const buffer = Buffer.from(data, 'base64');
      const decompressed = pako.inflate(buffer);
      const jsonString = Buffer.from(decompressed).toString('utf-8');
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression failed:', error);
      throw error;
    }
  }
}
