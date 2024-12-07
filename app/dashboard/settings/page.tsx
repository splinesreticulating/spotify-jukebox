import { fetchSettings } from '@/app/lib/data'
import SettingsTable from '@/app/ui/settings/table'
import ThemeSelector from '@/app/ui/theme-selector'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Settings',
}

export default async function SettingsPage() {
  const settings = await fetchSettings()

  return (
    <main>
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-xl md:text-2xl">Settings</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Theme:</span>
          <ThemeSelector />
        </div>
      </div>
      <SettingsTable settings={settings} />
    </main>
  )
}
