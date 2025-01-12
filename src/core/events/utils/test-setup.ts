import { eventBus, EventBus } from '../EventBus';

beforeAll(async () => {
  await eventBus.start();
});

afterEach(async () => {
  await eventBus.stop();
  EventBus.resetInstance();
  jest.clearAllMocks();
});

afterAll(async () => {
  await eventBus.stop();
  EventBus.resetInstance();
});
