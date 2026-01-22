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



export const METHOD_COLORS = {
    GET: "text-green-500 border-green-500 rounded px-1 border-[0.7px] bg-green-500/5",
    POST: "text-orange-500 border-orange-500 rounded px-1 border-[0.7px] bg-orange-500/5",
    PATCH: "text-purple-500 border-purple-500 rounded px-1 border-[0.7px] bg-purple-500/5",
    PUT: "text-blue-500 border-blue-500 rounded px-1 border-[0.7px] bg-blue-500/5",
    DELETE: "text-red-500 border-red-500 rounded px-1 border-[0.7px] bg-red-500/5",
};

export function PlaygroundSidebar({ endpoints }: { endpoints: EndpointResponse[] }) {
    const searchParams = useSearchParams();
    const path = usePathname();
    const activeEndpoint = searchParams.get('endpoint_id');
    return (
        <Sidebar className="">
            <SidebarContent className="pt-14">
                <SidebarGroup>
                    <SidebarGroupLabel>Playground</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {endpoints.map((endpoint) => {
                                const params = new URLSearchParams(searchParams.toString());
                                params.set("endpoint_id", endpoint.id.toString());
                                const endpointUrl = `${path}/?${params.toString()}`
                                const isActive = activeEndpoint === endpoint.id.toString();
                                console.log(isActive, activeEndpoint);
                                return <SidebarMenuItem key={endpoint.id} className={cn(isActive && "bg-sidebar-accent rounded-md")}>
                                    <SidebarMenuButton asChild>
                                        <Link href={endpointUrl}>
                                            <p className={cn(`text-[0.6rem]`, METHOD_COLORS[endpoint.method])}>{endpoint.method}</p>
                                            <span>{endpoint.title}</span>
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