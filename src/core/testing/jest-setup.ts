import { TextEncoder, TextDecoder } from 'util';

// Set up globals for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as any;

// Set up Request and Response globals if they don't exist
if (!global.Request) {
  global.Request = class Request {
    constructor(input: RequestInfo | URL, init?: RequestInit) {
      return new (require('node-fetch').Request)(input, init);
    }
  } as any;
}

if (!global.Response) {
  global.Response = require('node-fetch').Response;
}
