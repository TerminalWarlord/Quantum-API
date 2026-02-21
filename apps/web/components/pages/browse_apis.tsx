"use client";

import { ApiResult, SortBy, SortOrder } from "@repo/types";
import ApiCard from "../api_card";
import { useEffect, useRef } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Categories } from "../filter_categories";
import { Button } from "../ui/button";
import CategoryFilter from "../category_filter";
import NoResults from "../ui/no_results";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../ui/input-group";
import { IconSearch } from "@tabler/icons-react";
import { Field } from "../ui/field";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Pagination from "../ui/pagination";
import useSWR from "swr";
import { fetchApis } from "@/lib/browse/get_apis";
import Loading from "../ui/loading";



const BrowseApis = () => {
    const searchParams = useSearchParams();
    const { data: apis, isLoading, error, mutate } = useSWR(`/`, () => fetchApis({
        categories: searchParams.getAll('category_slug'),
        limit: parseInt(searchParams.get('limit') || "10"),
        offset: parseInt(searchParams.get('offset') || "0"),
        sort_by: searchParams.get('sort_by') as SortBy,
        sort_order: searchParams.get('sort_order') as SortOrder,
        query: searchParams.get('query')
    }))
    const inputRef = useRef<HTMLInputElement | null>(null);
    const path = usePathname();
    const router = useRouter();
    const searchQueries = new URLSearchParams(searchParams.toString());


    useEffect(() => {
        mutate();
    }, [searchParams]);

    useEffect(() => {
        if (!inputRef.current) return;
        inputRef.current.value = searchParams.get('query') || "";
    }, [inputRef]);


    const handleSearch = () => {
        if (!inputRef.current) return;
        searchQueries.set("query", inputRef.current.value);
        router.push(`${path}?${searchQueries.toString()}`);
    }

    const content = <>
        <div className="flex w-full">
            {apis && apis.results.length > 0 && <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 h-fit">
                {apis && apis?.results.map(api => {
                    return <ApiCard api={api} key={api.id} />
                })}
            </div>}
        </div>
        <Pagination
            hasNextPage={apis && apis.has_next_page || false}
        />
    </>

    return <div className="px-8 py-4">
        <h1 className="text-3xl tracking-tight font-semibold">Browse APIs</h1>
        <h6 className="text-stone-500 py-1">Browse 6+ APIs across various categories</h6>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-3 space-y-3 md:space-y-0 py-6">
            <Field>
                <InputGroup>
                    <InputGroupInput
                        placeholder="Search..."
                        ref={inputRef}
                        onKeyUp={(e) => {
                            if (e.key === "Enter") handleSearch();
                        }}
                    />
                    <InputGroupAddon>
                        <IconSearch />
                    </InputGroupAddon>
                </InputGroup>
            </Field>
            <div className="flex space-x-0 md:space-x-1 justify-between">
                <Select
                    name="sort_by"
                    defaultValue={searchQueries.get('sort_by') as SortBy || SortBy.TITLE}
                    onValueChange={(v) => {
                        if (Object.keys(SortBy).includes(v)) {
                            searchQueries.set("sort_by", v);
                            router.push(`${path}?${searchQueries.toString()}`);
                        }
                    }}>
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by</SelectLabel>
                            <SelectItem value={SortBy.TITLE} >Title</SelectItem>
                            <SelectItem value={SortBy.PRICE} >Price</SelectItem>
                            <SelectItem value={SortBy.POPULAR} >Popular</SelectItem>
                            <SelectItem value={SortBy.RATING} >Rating</SelectItem>
                            <SelectItem value={SortBy.PUBLISHED} >Published</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="block lg:hidden w-full">
                    <Categories />
                </div>
                <Button
                    onClick={() => handleSearch()}
                    className="cursor-pointer"
                >Search</Button>
            </div>

        </div>
        <div className="flex justify-center w-full">
            <div className="hidden lg:block w-3/11">
                <h6 className="tracking-tight font-semibold my-4">Categories</h6>
                <CategoryFilter />
            </div>
            <div className="flex flex-col w-full">
                {isLoading && <div className="">
                    <Loading />
                </div>}
                {apis && apis.results.length === 0 && <>
                    <NoResults />
                </>}

                {!isLoading && !error && content}

            </div>
        </div>
    </div>


}
export default BrowseApis;