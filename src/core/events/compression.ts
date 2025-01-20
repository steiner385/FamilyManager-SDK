import * as pako from 'pako';

export interface CompressionConfig {
  threshold: number;
  compressionLevel?: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
}

export class EventCompressor {
  private config: CompressionConfig;
  private encoder: TextEncoder;
  private decoder: TextDecoder;

  constructor(config: CompressionConfig) {
    this.config = {
      compressionLevel: 6,
      ...config
    };
    // Node.js environment - use Buffer instead of TextEncoder/TextDecoder
    this.encoder = {
      encode: (str: string) => Buffer.from(str)
    };
    this.decoder = {
      decode: (buf: Uint8Array) => Buffer.from(buf).toString()
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
      const uint8Array = this.encoder.encode(jsonString);
      
      const compressed = pako.deflate(uint8Array, {
        level: this.config.compressionLevel
      });
      
      // Convert to base64 for safe transmission
      return btoa(String.fromCharCode.apply(null, compressed as unknown as number[]));
    } catch (error) {
      console.error('Compression failed:', error);
      return data;
    }
  }

  async decompress(data: string): Promise<unknown> {
    try {
      // Convert from base64 to Uint8Array
      const binaryString = atob(data);
      const uint8Array = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        uint8Array[i] = binaryString.charCodeAt(i);
      }

      const decompressed = pako.inflate(uint8Array);
      const jsonString = this.decoder.decode(decompressed);
      return JSON.parse(jsonString);
    } catch (error) {
      console.error('Decompression failed:', error);
      throw error;
    }
  }
}
