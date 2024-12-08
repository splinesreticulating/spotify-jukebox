export type Setting = {
  name: string
  value: string
  description: string | null
}

export type SettingConfig = {
  type: 'number' | 'text' | 'boolean'
  options?: Array<{ value: string; label: string }>
}

export type SettingConfigs = Record<string, SettingConfig>
