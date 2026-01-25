import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { UserDashboardSidebar } from "@/components/user_dashboard/user_dashboard_sidebar";

import {
    SidebarProvider,
} from "@/components/ui/sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <SidebarProvider>

            <div className="flex min-h-screen w-full">
                <UserDashboardSidebar />

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