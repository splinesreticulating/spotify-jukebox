import SideNav from '@/app/ui/dashboard/sidenav'
import ThemeSelector from '@/app/ui/theme-selector'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
      <div className="w-full flex-none md:w-64">
        <SideNav />
      </div>
      <div className="grow p-6 md:overflow-y-auto md:p-12">
        <div className="mb-4 flex justify-end">
          <ThemeSelector />
        </div>
        {children}
      </div>
    </div>
  )
}
