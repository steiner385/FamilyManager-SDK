import { PluginMetadata } from '../types/plugin';
interface PluginCardProps {
    metadata: PluginMetadata & {
        dependencies?: string[];
    };
    isEnabled: boolean;
    isInstalled: boolean;
    onEnable: () => Promise<void>;
    onDisable: () => Promise<void>;
    onUninstall: () => Promise<void>;
    onConfigure: () => void;
}
export declare function PluginCard({ metadata, isEnabled, isInstalled, onEnable, onDisable, onUninstall, onConfigure }: PluginCardProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=PluginCard.d.ts.map