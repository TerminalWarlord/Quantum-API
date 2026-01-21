import PlaygroundContent from '@/components/playground/playground_content'
import PlaygroundSidebar from '@/components/playground/playground_sidebar'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'
import { db, sql } from '@repo/db/client'
import { IconLayoutSidebarLeftCollapse } from '@tabler/icons-react'
import React from 'react'

export interface Endpoint {
    method: string;
    title: string;
    description: string;
    slug: string;
    path: string;
    endpoint_id: number;
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    const slug = (await params).slug;
    const endpoints = await db.execute(sql`
        SELECT 
            e.method,
            e.title,
            e.description,
            a.slug,
            e.path,
            e.id as endpoint_id
        FROM endpoints AS e
        JOIN apis AS a
        ON a.id=e.api_id
        WHERE a.slug=${slug};
    `)
    console.log(endpoints.rows);
    return (
        <div>
            <Sheet>
                <SheetTrigger asChild>
                    <IconLayoutSidebarLeftCollapse />
                </SheetTrigger>
                <PlaygroundSidebar endpoints={endpoints.rows as unknown as Endpoint[]} />
                <PlaygroundContent/>

            </Sheet>
        </div>
    )
}
