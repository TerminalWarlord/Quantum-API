"use client";


import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { EndpointResponse } from "@repo/types"
import { usePathname, useSearchParams } from "next/navigation";
import { Home, Settings } from "lucide-react";
import { IconApi, IconPlus, IconStar, IconUser, IconUsers } from "@tabler/icons-react";



export const METHOD_COLORS = {
    GET: "text-green-500 border-green-500 rounded px-1 border-[0.7px] bg-green-500/5",
    POST: "text-orange-500 border-orange-500 rounded px-1 border-[0.7px] bg-orange-500/5",
    PATCH: "text-purple-500 border-purple-500 rounded px-1 border-[0.7px] bg-purple-500/5",
    PUT: "text-blue-500 border-blue-500 rounded px-1 border-[0.7px] bg-blue-500/5",
    DELETE: "text-red-500 border-red-500 rounded px-1 border-[0.7px] bg-red-500/5",
};

// Menu items.
const items = [
    {
        title: "Overview",
        url: "/dashboard/overview",
        icon: Home,
    },
    {
        title: "Subscriptions",
        url: "/dashboard/subscriptions",
        icon: IconUsers,
    },
    {
        title: "APIs",
        url: "/dashboard/my-apis",
        icon: IconApi,
    },
    {
        title: "Add API",
        url: "/dashboard/add-api",
        icon: IconPlus,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: IconUser,
    },
]

export function UserDashboardSidebar() {
    const path = usePathname();
    return (
        <Sidebar className="">
            <SidebarContent className="pt-14">
                <SidebarGroup>
                    <SidebarGroupLabel>User Dashboard</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => {
                                const isActive = path.includes(item.url);
                                // console.log(path, item.url,isActive);
                                return <SidebarMenuItem key={item.url} className={cn(isActive && "bg-sidebar-accent rounded-md")}>
                                    <SidebarMenuButton asChild>
                                        <Link href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}