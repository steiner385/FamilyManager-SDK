import { TextEncoder, TextDecoder } from 'util';
import nodeFetch from 'node-fetch';
// Set up globals for tests
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
// Set up Request and Response globals if they don't exist
if (!global.Request) {
    global.Request = nodeFetch.Request;
}
if (!global.Response) {
    global.Response = nodeFetch.Response;
}
//# sourceMappingURL=jest-setup.js.map