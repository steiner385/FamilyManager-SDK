import { gzip, gunzip } from 'node:zlib';
import { promisify } from 'node:util';
const gzipAsync = promisify(gzip);
const gunzipAsync = promisify(gunzip);
export class EventCompressor {
    constructor(config) {
        this.config = config;
    }
    shouldCompress(data) {
        const size = JSON.stringify(data).length;
        return size > this.config.threshold;
    }
    async compress(data) {
        if (!data || !this.shouldCompress(data)) {
            return data;
        }
        try {
            const jsonString = JSON.stringify(data);
            const compressed = await gzipAsync(jsonString, {
                level: this.config.compressionLevel
            });
            return compressed.toString('base64');
        }
        catch (error) {
            console.error('Compression failed:', error);
            return data;
        }
    }
    async decompress(data) {
        try {
            const buffer = Buffer.from(data, 'base64');
            const decompressed = await gunzipAsync(buffer);
            return JSON.parse(decompressed.toString());
        }
        catch (error) {
            console.error('Decompression failed:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=compression.js.map