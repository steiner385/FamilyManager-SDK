interface CompressionConfig {
    compressionLevel: number;
    threshold: number;
}
export declare class EventCompressor {
    private config;
    constructor(config: CompressionConfig);
    private shouldCompress;
    compress<T>(data: T): Promise<string | T>;
    decompress<T>(data: string): Promise<T>;
}
export {};
//# sourceMappingURL=compression.d.ts.map