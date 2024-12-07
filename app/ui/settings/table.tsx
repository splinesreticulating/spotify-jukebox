'use client'

import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { toastStyles } from '@/app/lib/constants/toast-styles'
import { useDebounce } from 'use-debounce'
import clsx from 'clsx'

type Setting = {
  name: string
  value: string
  description: string | null
}

const formatSettingName = (name: string): string => {
  return name
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.toLowerCase().slice(1))
    .join(' ')
}

// Define input types and ranges for specific settings
const settingConfigs: Record<
  string,
  { type: 'number' | 'text' | 'boolean'; options?: Array<{ value: string; label: string }> }
> = {
  LEVEL_LOCK: {
    type: 'number',
    options: [1, 2, 3, 4, 5].map((n) => ({ value: n.toString(), label: n.toString() })),
  },
  HIPNESS: {
    type: 'number',
    options: Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({ value: n.toString(), label: n.toString() })),
  },
  PROMISCUITY: {
    type: 'number',
    options: Array.from({ length: 10 }, (_, i) => i + 1).map((n) => ({ value: n.toString(), label: n.toString() })),
  },
  MODE_OVERRIDE: {
    type: 'boolean',
    options: [
      { value: 'true', label: 'True' },
      { value: 'false', label: 'False' },
    ],
  },
  BPM_MAX_MULTIPLIER: {
    type: 'number',
    options: Array.from({ length: 10 }, (_, i) => 1 + i / 100).map((n) => ({
      value: n.toFixed(2),
      label: n.toFixed(2),
    })),
  },
  BPM_MIN_MULTIPLIER: {
    type: 'number',
    options: Array.from({ length: 5 }, (_, i) => 0.96 + i / 100).map((n) => ({
      value: n.toFixed(2),
      label: n.toFixed(2),
    })),
  },
}

export default function SettingsTable({ settings }: { settings: Setting[] }) {
  const [values, setValues] = useState<Record<string, string>>(
    settings.reduce((acc, setting) => ({ ...acc, [setting.name]: setting.value }), {}),
  )
  const [debouncedValues] = useDebounce(values, 1000)

  const handleChange = (settingName: string, newValue: string) => {
    setValues((prev) => ({ ...prev, [settingName]: newValue }))
  }

  // Effect to save changes after debounce
  useEffect(() => {
    Object.entries(debouncedValues).forEach(async ([name, value]) => {
      if (value !== settings.find((s) => s.name === name)?.value) {
        try {
          const response = await fetch(`/api/settings/${name}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ value }),
          })

          if (!response.ok) throw new Error('Failed to update setting')
          toast.success('Setting updated', toastStyles.success)
        } catch (error) {
          toast.error('Failed to update setting', toastStyles.error)
          setValues((prev) => ({
            ...prev,
            [name]: settings.find((s) => s.name === name)?.value || '',
          }))
        }
      }
    })
  }, [debouncedValues])

  const renderInput = (setting: Setting) => {
    const config = settingConfigs[setting.name]

    if (config?.type === 'boolean') {
      return (
        <label className="relative inline-flex cursor-pointer items-center">
          <input
            type="checkbox"
            checked={values[setting.name] === 'true'}
            onChange={(e) => handleChange(setting.name, e.target.checked.toString())}
            className="peer sr-only"
          />
          <div
            className="peer h-6 w-11 rounded-full bg-gray-200 
            after:absolute after:left-[2px] after:top-[2px] 
            after:h-5 after:w-5 
            after:rounded-full after:border after:border-gray-300 after:bg-white 
            after:transition-all after:content-[''] peer-checked:bg-indigo-600 peer-checked:after:translate-x-full 
            peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300"
          ></div>
        </label>
      )
    }

    if (config?.type === 'number' && config.options) {
      return (
        <select
          value={values[setting.name]}
          onChange={(e) => handleChange(setting.name, e.target.value)}
          className="w-20 rounded-md border-0 py-1.5 pl-3 pr-8 text-gray-900 
            ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 
            sm:text-sm sm:leading-6"
        >
          {config.options.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      )
    }

    return (
      <input
        type="text"
        value={values[setting.name]}
        onChange={(e) => handleChange(setting.name, e.target.value)}
        className={clsx(
          'block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset',
          'ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset',
          'focus:ring-indigo-600 sm:text-sm sm:leading-6',
          setting.value.length > 20 ? 'w-full' : 'w-32',
        )}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {settings.map((setting) => (
          <div key={setting.name} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-gray-900/5">
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-medium text-gray-900">{formatSettingName(setting.name)}</h3>
                {renderInput(setting)}
              </div>
              {setting.description && <p className="text-sm text-gray-500">{setting.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
