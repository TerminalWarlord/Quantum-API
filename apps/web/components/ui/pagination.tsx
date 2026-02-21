"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Button } from "./button";
import { ButtonGroup } from "./button-group";

export default function Pagination({ hasNextPage }: { hasNextPage: boolean }) {
    const searchParams = useSearchParams();
    const limit = parseInt(searchParams.get('limit') || "10");
    const offset = parseInt(searchParams.get('offset') || "0");
    const path = usePathname();
    const router = useRouter();

    return <ButtonGroup className="my-4">
        <Button
            variant={'outline'}
            className="cursor-pointer"
            disabled={offset <= 0}
            onClick={() => {
                const url = new URL(`http://localhost:3000${path}`);
                for (const key of searchParams.keys()) {
                    const val = searchParams.get(key);
                    if (val) {
                        url.searchParams.set(key, val);
                    }
                }
                url.searchParams.set("offset", Math.max(0, offset - limit).toString());
                router.push(`${url.toString()}`);
            }}
        >Prev</Button>
        <Button
            variant={'outline'}
            disabled={!hasNextPage}
            className="cursor-pointer"
            onClick={() => {
                const url = new URL(`http://localhost:3000${path}`);
                for (const key of searchParams.keys()) {
                    const val = searchParams.get(key);
                    if (val) {
                        url.searchParams.set(key, val);
                    }
                }
                url.searchParams.set("offset", (offset + limit).toString());
                router.push(`${url.toString()}`);
            }}
        >Next</Button>
    </ButtonGroup>
}