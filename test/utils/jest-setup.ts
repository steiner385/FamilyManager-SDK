import { TextEncoder, TextDecoder } from 'util';
import nodeFetch from 'node-fetch';

// Set up globals for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder as typeof TextDecoder;

// Set up Request and Response globals if they don't exist
if (!global.Request) {
  global.Request = nodeFetch.Request as typeof Request;
}

if (!global.Response) {
  global.Response = nodeFetch.Response as typeof Response;
}
