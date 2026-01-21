"use client";

import { Api, ApiResult } from "@repo/types";
import ApiCard from "../api_card";
import SearchBar from "../searchbar";
import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "../ui/select";
import { Categories } from "../filter_categories";
import { Button } from "../ui/button";
import CategoryFilter from "../category_filter";
import NoResults from "../ui/no_results";




const BrowseApis = ({ apis }: {
    apis: ApiResult
}) => {

    const [searchQuery, setSearchQuery] = useState("");

    return <div className="px-8 py-4">
        <h1 className="text-3xl tracking-tight font-semibold">Browse APIs</h1>
        <h6 className="text-stone-500 py-1">Browse 6+ APIs across various categories</h6>
        <div className="flex flex-col md:flex-row space-x-0 md:space-x-3 space-y-3 md:space-y-0 py-6">
            <SearchBar
                searchQuery={searchQuery}
                updateSearchQuery={(q) => {
                    setSearchQuery(q);
                }}
            />
            <div className="flex space-x-0 md:space-x-1 justify-between">
                <Select name="sort_by">
                    <SelectTrigger className="w-45">
                        <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Sort by</SelectLabel>
                            <SelectItem value="popularity" >Popularity</SelectItem>
                            <SelectItem value="rating">Rating</SelectItem>
                            <SelectItem value="name">Name</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <div className="block lg:hidden w-full">
                    <Categories />
                </div>
                <Button>Search</Button>
            </div>

        </div>
        <div className="flex justify-center w-full">
            <div className="hidden lg:block w-3/11">
                <h6 className="tracking-tight font-semibold my-4">Categories</h6>
                <CategoryFilter />
            </div>
            <div className="flex w-full">
                {apis && apis.results.length === 0 ? <>
                    <NoResults />
                </> : <div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 h-fit">
                    {apis.results.map(api => {
                        return <ApiCard api={api} key={api.id} />
                    })}
                </div>}
            </div>
        </div>
    </div>


}
export default BrowseApis;