import { PrismaClient } from '@prisma/client';
import { serve } from '@hono/node-server';
import { Hono } from 'hono';
import { Context } from 'hono';
import { config } from 'dotenv';
import { join } from 'path';
import { createTestUser } from './test-utils';
import { prisma as mockPrisma } from '../../lib/prisma';
import type { Server, IncomingMessage, ServerResponse } from 'node:http';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import supertest from 'supertest';
import { apiRoutes } from '../../routes/api';
import type { Next } from 'hono';
import { generateToken } from '../../utils/auth';
import { AppError } from '../../errors/AppError';
import { HTTPException } from 'hono/http-exception';
import { corsMiddleware } from '../../middleware/cors';
import { Blob } from 'node:buffer';
import { ReadableStream, TransformStream, WritableStream } from 'node:stream/web';
import jwt from 'jsonwebtoken';
import { createServer } from 'node:http';
import { createServer as createNetServer } from 'node:net';

// Add Node.js polyfills
import { TextEncoder as NodeTextEncoder, TextDecoder as NodeTextDecoder } from 'util';
(global as any).TextEncoder = NodeTextEncoder;
(global as any).TextDecoder = NodeTextDecoder;
(global as any).ReadableStream = ReadableStream;
(global as any).TransformStream = TransformStream;
(global as any).WritableStream = WritableStream;
(global as any).Blob = Blob;

// Add Request polyfill for Node environment
import { fetch, Headers, FormData, Request as NodeRequest, Response as NodeResponse } from 'undici';
(global as any).fetch = fetch;
(global as any).Headers = Headers;
(global as any).FormData = FormData;
(global as any).Request = NodeRequest;
(global as any).Response = NodeResponse;

// Load test environment variables
config({ path: join(__dirname, '../../../../.env.test') });

// Ensure test environment is set
process.env.TEST_ENV = 'node';

let serverInstance: { server: Server; app: Hono } | null = null;
let testPort = parseInt(process.env.PORT || '3000');
let prismaInstance: PrismaClient | null = null;

export interface TestContext {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    username: string;
    role: string;
  };
  app: Hono;
  server: Server;
  serverInstance: { server: Server; app: Hono };
  agent: any;
  parentToken?: string;
  parentId?: string;
  memberToken?: string;
  memberId?: string;
  familyId?: string;
}

interface MockUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  role: string;
  familyId: string | null;
  family: () => Promise<MockFamily | null>;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface MockFamily {
  id: string;
  name: string;
  members: MockUser[];
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
}

function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    prismaInstance = new PrismaClient();
  }
  return prismaInstance;
}

export async function cleanupTestDatabase(): Promise<void> {
  const prisma = getPrisma();
  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.updateMany({
        where: { familyId: { not: null } },
        data: { familyId: null }
      });
      await tx.family.deleteMany();
      await tx.user.deleteMany();
    });
  } catch (error) {
    console.error('Database cleanup error:', error);
    throw error;
  }
}

function registerRoutes(app: Hono) {
  app.use('*', corsMiddleware);

  app.get('/health', (c) => c.json({ status: 'ok' }));
  app.get('/_ready', (c) => c.json({ status: 'ready' }));
  app.get('/_routes', (c) => c.json({ status: 'ok' }));

  const apiApp = new Hono();

  apiApp.onError((err, c) => {
    if (err instanceof AppError) {
      const status = err.statusCode || 500;
      const body = {
        error: { message: err.message, code: err.code }
      };
      return new Response(JSON.stringify(body), { 
        status,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    console.error('Unhandled error:', err);
    return new Response(JSON.stringify({
      error: { message: 'Internal Server Error', code: 'INTERNAL_ERROR' }
    }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  });

  for (const route of apiRoutes.routes) {
    const method = route.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
    const path = route.path.startsWith('/') ? route.path : `/${route.path}`;
    
    const handler = async (c: Context) => {
      try {
        return await route.handler(c);
      } catch (error) {
        if (error instanceof AppError) {
          const status = error.statusCode || 500;
          const body = {
            error: { message: error.message, code: error.code }
          };
          return new Response(JSON.stringify(body), {
            status,
            headers: { 'Content-Type': 'application/json' }
          });
        }
        throw error;
      }
    };

    if (route.middleware?.length) {
      apiApp[method](path, ...route.middleware, handler);
    } else {
      apiApp[method](path, handler);
    }
  }

  app.route('/api', apiApp);

  app.all('*', (c) => {
    return new Response(JSON.stringify({ 
      error: { message: 'Route not found', code: 'NOT_FOUND' }
    }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  });
}

export async function getTestServer(): Promise<{ server: Server; app: Hono }> {
  const app = new Hono();
  registerRoutes(app);

  while (await isPortInUse(testPort)) {
    testPort++;
  }

    const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    try {
      let requestBody: string | undefined;
      if (req.method !== 'GET' && req.method !== 'HEAD') {
        requestBody = await new Promise<string>((resolve) => {
          let data = '';
          req.on('data', chunk => {
            data += chunk;
          });
          req.on('end', () => {
            resolve(data);
          });
        });
      }

      const url = req.url || '/';
      const normalizedUrl = url.startsWith('/') ? url : `/${url}`;
      const request = new NodeRequest(`http://localhost:${testPort}${normalizedUrl}`, {
        method: req.method,
        headers: req.headers as HeadersInit,
        body: requestBody
      });

      const response = await app.fetch(request as unknown as Request);
      res.statusCode = response.status;
      
      for (const [key, value] of response.headers.entries()) {
        res.setHeader(key, value);
      }

      const responseBody = await response.text();
      res.end(responseBody);
    } catch (error) {
      console.error('Server error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    }
  });

  await new Promise<void>((resolve) => {
    server.listen(testPort, () => resolve());
  });

  serverInstance = { app, server };
  return serverInstance;
}

async function isPortInUse(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createNetServer();
    server.once('error', () => {
      resolve(true);
    });
    server.once('listening', () => {
      server.close();
      resolve(false);
    });
    server.listen(port);
  });
}

export async function setupTestContext(): Promise<TestContext> {
  try {
    await cleanupTestContext();

    // Set up mock data store
    const mockDataStore = {
      families: new Map(),
      users: new Map<string, MockUser>()
    };

    // Set up mock implementations
    const userCreateMock = mockPrisma.user.create as jest.Mock;
    userCreateMock.mockImplementation((args: { data: any }) => {
      const user: MockUser = {
        id: args.data.id || `test-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        email: args.data.email,
        firstName: args.data.firstName || 'Test',
        lastName: args.data.lastName || 'User',
        username: args.data.username,
        role: args.data.role || 'MEMBER',
        familyId: args.data.familyId || null,
        family: () => Promise.resolve(null),
        password: args.data.password,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDataStore.users.set(user.id, user);
      return Promise.resolve(user);
    });

    const familyCreateMock = mockPrisma.family.create as jest.Mock;
    familyCreateMock.mockImplementation((args: { data: any }) => {
      const family: MockFamily = {
        id: `family-${Date.now()}`,
        name: args.data.name,
        members: [],
        description: null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      mockDataStore.families.set(family.id, family);
      return Promise.resolve(family);
    });

    const userFindUniqueMock = mockPrisma.user.findUnique as jest.Mock;
    userFindUniqueMock.mockImplementation((args: { where: { id: string } }) => {
      const user = mockDataStore.users.get(args.where.id);
      if (!user) {
        console.log('User not found in mockDataStore for id:', args.where.id);
        console.log('Available user ids:', Array.from(mockDataStore.users.keys()));
        return Promise.resolve(null);
      }

      return Promise.resolve({
        ...user,
        family: () => {
          const family = mockDataStore.families.get(user.familyId || '');
          return Promise.resolve(family || null);
        }
      });
    });

    const familyFindUniqueMock = mockPrisma.family.findUnique as jest.Mock;
    familyFindUniqueMock.mockImplementation((args: { where: { id: string } }) => {
      return Promise.resolve(mockDataStore.families.get(args.where.id) || null);
    });

    const familyUpdateMock = mockPrisma.family.update as jest.Mock;
    familyUpdateMock.mockImplementation((args: { where: { id: string }, data: any }) => {
      const family = mockDataStore.families.get(args.where.id);
      if (!family) return Promise.resolve(null);

      const updatedFamily = {
        ...family,
        ...args.data,
        members: [...family.members],
        updatedAt: new Date()
      };

      if (args.data.members?.connect) {
        const memberIds = Array.isArray(args.data.members.connect) 
          ? args.data.members.connect.map((m: { id: string }) => m.id)
          : [(args.data.members.connect as { id: string }).id];

        for (const memberId of memberIds) {
          const user = mockDataStore.users.get(memberId);
          if (user && !updatedFamily.members.some((m: MockUser) => m.id === memberId)) {
            const updatedUser = {
              ...user,
              familyId: family.id,
              family: () => Promise.resolve(updatedFamily)
            };
            mockDataStore.users.set(memberId, updatedUser);
            updatedFamily.members.push(updatedUser);
          }
        }
      }

      if (args.data.members?.disconnect) {
        const memberIds = Array.isArray(args.data.members.disconnect) 
          ? args.data.members.disconnect.map((m: { id: string }) => m.id)
          : [(args.data.members.disconnect as { id: string }).id];

        updatedFamily.members = updatedFamily.members.filter((m: MockUser) => !memberIds.includes(m.id));
        
        for (const memberId of memberIds) {
          const user = mockDataStore.users.get(memberId);
          if (user) {
            const updatedUser = {
              ...user,
              familyId: null,
              family: () => Promise.resolve(null)
            };
            mockDataStore.users.set(memberId, updatedUser);
          }
        }
      }

      mockDataStore.families.set(args.where.id, updatedFamily);
      return Promise.resolve(updatedFamily);
    });

    const userUpdateMock = mockPrisma.user.update as jest.Mock;
    userUpdateMock.mockImplementation((args: { where: { id: string }, data: any }) => {
      const user = mockDataStore.users.get(args.where.id);
      if (!user) {
        console.log('User not found for update:', args.where.id);
        console.log('Available users:', Array.from(mockDataStore.users.keys()));
        return Promise.resolve(null);
      }

      const updatedUser = {
        ...user,
        ...args.data,
        id: user.id,
        email: user.email,
        updatedAt: new Date(),
        family: () => {
          const family = mockDataStore.families.get(args.data.familyId || user.familyId || '');
          return Promise.resolve(family || null);
        }
      };

      mockDataStore.users.set(user.id, updatedUser);
      console.log('Updated user:', updatedUser);
      return Promise.resolve(updatedUser);
    });

    // Create family
    const family = await mockPrisma.family.create({
      data: {
        name: 'Test Family'
      }
    });

    // Create users without familyId first
    const parentResponse = await createTestUser({
      role: 'PARENT',
      firstName: 'Test',
      lastName: 'Parent',
      email: `parent_${Date.now()}@test.com`,
      username: `parent_${Date.now()}`
    });

    const memberResponse = await createTestUser({
      role: 'MEMBER',
      firstName: 'Test',
      lastName: 'Member',
      email: `member_${Date.now()}@test.com`,
      username: `member_${Date.now()}`
    });

    // Update family with members
    const updatedFamily = await mockPrisma.family.update({
      where: { id: family.id },
      data: {
        members: {
          connect: [
            { id: parentResponse.user.id },
            { id: memberResponse.user.id }
          ]
        }
      }
    });

    // Update users with familyId
    const updatedParent = await mockPrisma.user.update({
      where: { id: parentResponse.user.id },
      data: { 
        familyId: family.id,
        role: 'PARENT'
      }
    });

    const updatedMember = await mockPrisma.user.update({
      where: { id: memberResponse.user.id },
      data: { 
        familyId: family.id,
        role: 'MEMBER'
      }
    });

    // Generate tokens
    const parentToken = await generateToken({
      userId: parentResponse.user.id,
      email: parentResponse.user.email,
      role: 'PARENT',
      familyId: family.id
    });

    const memberToken = await generateToken({
      userId: memberResponse.user.id,
      email: memberResponse.user.email,
      role: 'MEMBER',
      familyId: family.id
    });

    // Set up server
    const { app, server } = await getTestServer();
    const agent = supertest(`http://localhost:${testPort}`);

    const context: TestContext = {
      user: {
        id: parentResponse.user.id,
        email: parentResponse.user.email,
        firstName: parentResponse.user.firstName,
        lastName: parentResponse.user.lastName,
        username: parentResponse.user.username,
        role: parentResponse.user.role
      },
      app,
      server,
      serverInstance: { server, app },
      agent,
      parentToken,
      parentId: updatedParent.id,
      memberToken,
      memberId: updatedMember.id,
      familyId: family.id
    };

    return context;
  } catch (error) {
    console.error('Test setup error:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

export async function cleanupTestContext(): Promise<void> {
  try {
    await cleanupTestDatabase();

    if (serverInstance?.server) {
      await new Promise<void>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Server close timeout'));
        }, 5000);

        serverInstance?.server.close(() => {
          clearTimeout(timeout);
          resolve();
        });
      });
      serverInstance = null;
    }

    if (prismaInstance) {
      await prismaInstance.$disconnect();
      prismaInstance = null;
    }
  } catch (error) {
    console.error('Test cleanup error:', error);
    serverInstance = null;
    prismaInstance = null;
  }
}
