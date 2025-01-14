/**
 * Plugin system event types and payloads
 */
/**
 * Plugin event types
 */
export var PluginEventType;
(function (PluginEventType) {
    PluginEventType["INITIALIZED"] = "plugin.initialized";
    PluginEventType["TEARDOWN"] = "plugin.teardown";
    PluginEventType["ERROR"] = "plugin.error";
    PluginEventType["DEPENDENCY_CHANGED"] = "plugin.dependency.changed";
})(PluginEventType || (PluginEventType = {}));
/**
 * Creates a plugin event with the specified type and payload
 */
export function createPluginEvent(type, payload, source) {
    return {
        id: `plugin-${Date.now()}`,
        type,
        channel: 'plugin',
        timestamp: Date.now(),
        source,
        data: payload,
        metadata: { payload }
    };
}
//# sourceMappingURL=events.js.map