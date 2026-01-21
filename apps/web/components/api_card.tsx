import { Api } from "@repo/types";
import { IconStarFilled, IconUsers } from "@tabler/icons-react";
import Image from "next/image";
import { Button } from "./ui/button";
import Link from "next/link";

export default function ApiCard({ api }: { api: Api }) {
    return <div className="border border-stone-500/20 rounded-md p-4
    flex flex-col space-y-2
    h-fit w-full">
        <div className="flex space-x-2 items-center">
            <div className="h-14 w-14 bg-stone-100/90 dark:bg-stone-300/10 flex items-center justify-center rounded-md">
                <img
                    width={40}
                    height={40}
                    src={api.thumbnail_url}
                    alt={api.title}
                    className="rounded-md"
                />
            </div>
            <div>
                <h1 className="text-md font-semibold tracking-tight">{api.title}</h1>
                <p className="text-sm text-stone-500">{api.developer_name}</p>
            </div>
        </div>
        <div className="max-w-80">
            <p className="text-stone-500 leading-5 tracking-tight text-sm line-clamp-2">{api.description}</p>
        </div>
        <div>
            <Link
                href={`/browse?category_slug=${api.category_slug}`}
                className="text-xs bg-stone-100 dark:bg-stone-700 w-fit px-2.5 py-0.5 rounded-lg"
            >
                {api.category_name}
            </Link>
        </div>
        <div className="flex justify-between">
            <div className="flex space-x-2">
                <div className="flex items-center space-x-1">
                    <IconStarFilled className="text-orange-400" size={18} />
                    <p className="text-sm text-stone-500">{Number(api.rating).toPrecision(3)}</p>
                </div>
                <div className="flex items-center space-x-1  text-stone-500">
                    <IconUsers size={18} />
                    <p className="text-sm">{api.review_count}</p>
                </div>
            </div>
            <Button variant={'outline'} className="text-xs">
                <Link href={`/api/${api.slug}`}>
                    View Details
                </Link>
            </Button>
        </div>
    </div>
}