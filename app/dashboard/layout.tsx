import SideNav from "@/app/components/dashboard/Sidenav"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNav />
            </div>
            <div className="grow p-6 md:overflow-y-auto md:p-12 pb-24 sm:pb-0">
                {children}
            </div>
        </div>
    )
}
