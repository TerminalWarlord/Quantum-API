"use client";

import React from 'react'
import { SheetContent, SheetTitle } from '../ui/sheet'
import { Endpoint } from '@/app/(main)/api/[slug]/playground/page'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { BACKEND_URL } from '@/lib/config';

const PlaygroundSidebar = ({ endpoints }: { endpoints: Endpoint[] }) => {
    const searchParams = useSearchParams();
    const router = useRouter();
    const path = usePathname();

    return (
        <SheetContent className='p-2'>
            <SheetTitle>Endpoints</SheetTitle>
            <div className='flex flex-col items-start justify-center'>
                {endpoints.map(endpoint => {
                    return <div key={endpoint.slug} className='flex space-x-2 items-center hover:bg-cyan-200/40 w-full px-2 py-0.5 rounded-md cursor-pointer' onClick={() => {
                        const params = new URLSearchParams(searchParams.toString());
                        params.set('endpoint_id', endpoint.endpoint_id.toString());
                        router.push(`${path}/?${params.toString()}`);
                    }}>
                        <p className='text-xs tracking-tighter text-green-500'>{endpoint.method}</p>
                        <p className='text-sm text-stone-700'>{endpoint.path}</p>
                    </div>

                })}
            </div>

        </SheetContent>

    )
}

export default PlaygroundSidebar