"use client";
import React from 'react'
import { Checkbox } from './ui/checkbox';
import { Label } from './ui/label';
import { useRouter, useSearchParams } from 'next/navigation';
import useSWR from "swr";
import { BACKEND_URL } from '@/lib/config';
import { categories } from '@/data/mock';
import { Category } from '@repo/types';
import { Loader2 } from 'lucide-react';
import { IconError404, IconExclamationCircleFilled } from '@tabler/icons-react';


const CATEGORIES = [
    {
        slug: "social",
        title: "Social"
    },
    {
        slug: "dev-tools",
        title: "Dev Tools"
    },
]


const fetcher = async (url: string) => fetch(url).then(res => (res.json() as Promise<{ results: Category[] }>).then(r => r.results));

const CategoryFilter = () => {

    const router = useRouter();

    const { data, error, isLoading } = useSWR(`${BACKEND_URL}/categories`, fetcher)

    const searchParams = useSearchParams();


    const onClickHandler = (category_slug: string) => {
        const params = new URLSearchParams(searchParams.toString());
        const currentSelected = params.getAll('category_slug');
        if (currentSelected.includes(category_slug)) {
            params.delete("category_slug");
            currentSelected.forEach(cat => {
                if (cat !== category_slug) {
                    params.append("category_slug", cat);
                }

            });
        }
        else {
            params.append("category_slug", category_slug);
        }
        router.push(`?${params.toString()}`);
    }
    if (isLoading) {
        return <div className='flex w-full items-center justify-center min-h-36'>
            <Loader2 />
        </div>
    }

    if (error) {
        return <div className='flex w-full items-center justify-center min-h-36 flex-col space-y-2 tracking-tight'>
            <IconExclamationCircleFilled size={45}/>
            <p>Failed to fetch categories!</p>
        </div>
    }



    return (
        <div className="px-4 flex flex-col space-y-2">
            {data && data.length && data.map(cat => {
                const params = new URLSearchParams(searchParams.toString());
                const currentSelectedCategories = params.getAll('category_slug');
                const isChecked = currentSelectedCategories.includes(cat.slug)
                return <div className="flex space-x-1 items-center" key={cat.slug}>
                    <Checkbox
                        className="border-cyan-400!
                        data-[state=checked]:border-cyan-400!
                        data-[state=checked]:bg-cyan-400!
                        data-[state=checked]:text-white
                        dark:data-[state=checked]:text-black
                        "
                        checked={isChecked}
                        onCheckedChange={() => onClickHandler(cat.slug)}
                    />
                    <Label htmlFor={cat.slug} className="cursor-pointer font-semibold" >
                        {cat.name}
                    </Label>
                </div>
            })}
        </div>
    )
}

export default CategoryFilter;