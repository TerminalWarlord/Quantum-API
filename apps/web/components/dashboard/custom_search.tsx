"use client";

import React, { useEffect, useState } from 'react'
import { Input } from '../ui/input'
import { IconSearch } from '@tabler/icons-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const CustomSearchBar = ({ className }: { className?: string }) => {
    const [currentQuery, setCurrentQuery] = useState("");
    const router = useRouter();
    const searchParams = useSearchParams();
    const path = usePathname();

    useEffect(() => {
        const params = new URLSearchParams(searchParams.toString());
        const query = params.get('query');
        if (!query) return;
        setCurrentQuery(query);
    }, [searchParams]);


    const handleSubmit = () => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('query', currentQuery);
        router.push(`${path}?${params.toString()}`);
    }
    return (
        <div className={cn("m-2 flex space-x-2 items-center", className)}>
            <Input
                type="text"
                placeholder="Search..."
                className='text-xs'
                value={currentQuery}
                onChange={(e) => setCurrentQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        handleSubmit();
                    }
                }}
            />
            <div
                className='w-8 h-8 bg-black dark:bg-stone-600 text-white flex items-center justify-center rounded-sm'
                onClick={() => handleSubmit()}
            >
                <IconSearch size={15} className='cursor-pointer' />
            </div>
        </div>
    )
}

export default CustomSearchBar;