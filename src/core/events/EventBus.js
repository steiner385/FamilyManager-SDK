// Import necessary modules
const { v4: uuidv4 } = require('uuid');
const { logger } = require('../logging/Logger');
const { EventDeliveryStatus } = require('./types');

// EventBus class definition
class EventBus {
    constructor(config = {}) {
        this.subscriptions = new Map();
        this.channels = new Set();
        this.isRunning = false;
        this.busConfig = config;
        this.emitterConfig = {
            maxRetries: 3,
            retryDelay: 1000,
            ...config
        };
    }
    static getInstance(config) {
        if (!EventBus.instance) {
            EventBus.instance = new EventBus(config);
        }
        return EventBus.instance;
    }
    static resetInstance() {
        EventBus.instance = new EventBus();
    }
    getRunningState() {
        return this.isRunning;
    }
    async start() {
        this.isRunning = true;
        logger.info('EventBus started');
    }
    async stop() {
        this.isRunning = false;
        this.clearSubscriptions();
        logger.info('EventBus stopped');
    }
    registerChannel(channel) {
        if (this.channels.has(channel)) {
            throw new Error(`Channel ${channel} is already registered`);
        }
        this.channels.add(channel);
        this.subscriptions.set(channel, new Map());
        logger.debug(`Registered channel: ${channel}`);
    }
    subscribe(channel, handler) {
        if (!this.isRunning) {
            throw new Error('Cannot subscribe while EventBus is stopped');
        }
        if (!this.channels.has(channel)) {
            throw new Error(`Channel ${channel} is not registered`);
        }
        const id = uuidv4();
        const subscription = {
            id,
            eventType: channel,
            handler,
            unsubscribe: () => this.unsubscribe(id)
        };
        const channelSubs = this.subscriptions.get(channel);
        channelSubs.set(id, subscription);
        logger.debug(`Subscribed to channel ${channel}`, { subscriptionId: id });
        return id;
    }
    unsubscribe(subscriptionId) {
        for (const [channel, subs] of this.subscriptions.entries()) {
            if (subs.delete(subscriptionId)) {
                logger.debug(`Unsubscribed from channel ${channel}`, { subscriptionId });
                return;
            }
        }
    }
    async emit(event) {
        if (!this.isRunning) {
            throw new Error('Cannot emit events while EventBus is stopped');
        }
        if (!this.channels.has(event.type)) {
            throw new Error(`Channel ${event.type} is not registered`);
        }
        const channelSubs = this.subscriptions.get(event.type);
        if (!channelSubs || channelSubs.size === 0) {
            logger.debug(`No subscribers for event ${event.type}`);
            return EventDeliveryStatus.SUCCESS;
        }
        let failedCount = 0;
        let successCount = 0;
        const results = await Promise.allSettled(Array.from(channelSubs.values()).map(sub => this.deliverWithRetry(sub, event)));
        results.forEach(result => {
            if (result.status === 'rejected') {
                failedCount++;
                logger.error(`Failed to deliver event to subscriber`, {
                    error: result.reason,
                    type: event.type
                });
            }
            else {
                successCount++;
            }
        });
        if (failedCount > 0 && successCount > 0) {
            return EventDeliveryStatus.PARTIAL;
        }
        else if (failedCount > 0) {
            return EventDeliveryStatus.FAILED;
        }
        return EventDeliveryStatus.SUCCESS;
    }
    async deliverWithRetry(subscription, event, attempt = 1) {
        try {
            await subscription.handler(event);
        }
        catch (error) {
            if (attempt >= this.emitterConfig.maxRetries) {
                logger.error(`Max retries reached for event delivery`, {
                    subscriptionId: subscription.id,
                    error,
                });
                throw error;
            }
            logger.warn(`Retrying event delivery`, {
                attempt,
                subscriptionId: subscription.id,
            });
            await new Promise(resolve => setTimeout(resolve, this.emitterConfig.retryDelay));
            return this.deliverWithRetry(subscription, event, attempt + 1);
        }
    }
    getSubscriptionCount(channel) {
        return this.subscriptions.get(channel)?.size || 0;
    }
    clearSubscriptions() {
        for (const channelSubs of this.subscriptions.values()) {
            channelSubs.clear();
        }
    }
    getChannels() {
        return Array.from(this.channels);
    }
}
// Export a default instance
const eventBus = EventBus.getInstance();

module.exports = {
  EventBus,
  eventBus
};
