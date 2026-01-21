import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app_sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />

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