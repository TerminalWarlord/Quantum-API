"use client";

import { IconSearch } from "@tabler/icons-react";
import { Input } from "./ui/input";
import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";


export default function SearchBar({ placeholder }: { placeholder?: string }) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const searchParams = useSearchParams();
    const path = usePathname();
    const router = useRouter();
    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.value = searchParams.get('query') || "";

    }, [inputRef]);


    return <div className="relative flex-1 z-0">
        <IconSearch className="absolute z-0 left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
            ref={inputRef}
            className="pl-10"
            placeholder={placeholder ? placeholder : "Search..."}
            onChange={() => {
                if (!inputRef.current) return;
                const searchQueries = new URLSearchParams(searchParams.toString());
                searchQueries.set("query", inputRef.current.value);
                router.push(`${path}?${searchQueries.toString()}`);
            }} />
    </div>
}