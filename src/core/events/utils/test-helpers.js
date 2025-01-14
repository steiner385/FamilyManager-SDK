export function createTestEvent(type, data, source = 'test-service') {
    return {
        id: `test-${Date.now()}`,
        type,
        channel: 'test-channel',
        source,
        timestamp: Date.now() + performance.now(),
        data
    };
}
export function createTestEvents(count, data) {
    return Array.from({ length: count }, () => createTestEvent('TEST_TYPE', data));
}
export function createMockEventHandler() {
    const receivedEvents = [];
    const handler = async (event) => {
        receivedEvents.push(event);
    };
    return { handler, receivedEvents };
}
export function createMockErrorHandler(errorMessage) {
    return async () => {
        throw new Error(errorMessage);
    };
}
//# sourceMappingURL=test-helpers.js.map