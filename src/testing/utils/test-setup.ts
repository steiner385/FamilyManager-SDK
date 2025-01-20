import { Request } from '@jest/globals';

export const setupTestApp = () => {
  return {
    request: async (req: Request) => {
      // Mock response implementation
      return new Response(JSON.stringify({ status: 'success' }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  };
};
