import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AdminDashboardSidebar } from "@/components/admin_dashboard_sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AdminDashboardSidebar />

        <SidebarInset className="flex-1 min-w-0">
          <header className="p-2">
            <SidebarTrigger />
          </header>

          {children}
        </SidebarInset>
      </div>
    </SidebarProvider>
  )
}