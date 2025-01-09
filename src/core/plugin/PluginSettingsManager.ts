import { StatePersistenceManager } from '../state/StatePersistenceManager'

interface PluginSettings {
  enabled: boolean
  preferences: Record<string, any>
  permissions: string[]
}

export class PluginSettingsManager {
  private static instance: PluginSettingsManager
  private persistenceManager = StatePersistenceManager.getInstance()

  private constructor() {}

  static getInstance(): PluginSettingsManager {
    if (!PluginSettingsManager.instance) {
      PluginSettingsManager.instance = new PluginSettingsManager()
    }
    return PluginSettingsManager.instance
  }

  getSettings(pluginName: string): PluginSettings {
    return this.persistenceManager.retrieve(`plugin:${pluginName}:settings`) || {
      enabled: false,
      preferences: {},
      permissions: []
    }
  }

  updateSettings(pluginName: string, settings: Partial<PluginSettings>) {
    const currentSettings = this.getSettings(pluginName)
    const newSettings = {
      ...currentSettings,
      ...settings
    }
    this.persistenceManager.persist(`plugin:${pluginName}:settings`, newSettings)
  }

  clearSettings(pluginName: string) {
    this.persistenceManager.remove(`plugin:${pluginName}:settings`)
  }

  exportSettings(): Record<string, PluginSettings> {
    const allSettings: Record<string, PluginSettings> = {}
    // Implementation would iterate through all plugins and export their settings
    return allSettings
  }

  importSettings(settings: Record<string, PluginSettings>) {
    Object.entries(settings).forEach(([pluginName, settings]) => {
      this.updateSettings(pluginName, settings)
    })
  }
}
