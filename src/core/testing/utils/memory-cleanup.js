import { cleanupMemory } from '../../modules/banking/__tests__/utils/memory-utils';
beforeEach(async () => {
    await cleanupMemory();
});
afterEach(async () => {
    await cleanupMemory();
});
afterAll(async () => {
    await cleanupMemory();
    // Force final GC if available
    if (global.gc) {
        global.gc();
    }
});
//# sourceMappingURL=memory-cleanup.js.map