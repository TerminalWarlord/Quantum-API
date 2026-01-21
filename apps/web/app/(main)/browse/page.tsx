
// import ApiCard from "@/components/api-card";
// import BrowseCategory from "@/components/browse-category";
// import { FilterCategories } from "@/components/filter-categories";
// import SearchBar from "@/components/searchbar";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { mockApis } from "@/data/mock";
// import { Category } from "@repo/types";
// import { IconFilter } from "@tabler/icons-react";
// import { useSearchParams } from "next/navigation";
// import { useState } from "react";

import BrowseApis from "@/components/pages/browse_apis";
import { fetchApis } from "@/lib/browse/get_apis";
import { Suspense } from "react";
import Loading from "./loading";





// GET search params in SSC: https://nextjs.org/docs/app/api-reference/file-conventions/page#searchparams-optional
export default async function Page({ searchParams }: {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined
    }>
}) {
    const params = await searchParams;
    const categories = params.category_slug;
    // const limit = parseInt(params.limit || "10");

    const filteredCategories = Array.isArray(categories) ? categories : (!categories ? undefined : [categories]);

    const apis = await fetchApis({
        categories: filteredCategories,
    })
    console.log(apis);
    return <Suspense fallback={<Loading />}>
        <BrowseApis apis={apis} />
    </Suspense>
    
}