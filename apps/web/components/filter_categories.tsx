import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { IconFilter } from "@tabler/icons-react"
import { Checkbox } from "./ui/checkbox"
import { useRouter, useSearchParams } from "next/navigation"
import CategoriesFilter from "./category_filter"

export function Categories() {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline">
                    <IconFilter />
                    Filters
                </Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Categories</SheetTitle>
                </SheetHeader>
                <CategoriesFilter/>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button variant="outline">Close</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    )
}
