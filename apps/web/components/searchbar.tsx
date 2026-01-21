import { IconSearch } from "@tabler/icons-react";
import { Input } from "./ui/input";


export default function SearchBar({ searchQuery, updateSearchQuery }:
    {
        searchQuery: string,
        updateSearchQuery: (q: string) => void
    }
) {
    return <div className="relative flex-1 z-0">
        <IconSearch className="absolute z-0 left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input className="pl-10" placeholder="Search APIs..." onChange={(e) => updateSearchQuery(e.target.value)} />
    </div>
}