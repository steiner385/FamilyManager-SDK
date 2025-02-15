/// <reference types="node" />

declare global {
  // Extend the global interface with dom.lib.d.ts definitions
  interface TextDecoderInterface extends TextDecoder {}
  interface TextEncoderInterface extends TextEncoder {}
  
  interface Window {
    TextDecoder: typeof TextDecoder;
    TextEncoder: typeof TextEncoder;
  }

  var TextDecoder: {
    new(label?: string, options?: TextDecoderOptions): TextDecoder;
    prototype: TextDecoder;
  };
  var TextEncoder: {
    new(): TextEncoder;
    prototype: TextEncoder;
  };
  var Request: {
    new(input: RequestInfo | URL, init?: RequestInit): Request;
    prototype: Request;
  };
  var Response: {
    new(body?: BodyInit | null, init?: ResponseInit): Response;
    prototype: Response;
    error(): Response;
    json(data: any, init?: ResponseInit): Response;
    redirect(url: string | URL, status?: number): Response;
  };
}

export {};