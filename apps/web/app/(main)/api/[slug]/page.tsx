import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Pricing from "@/components/pricing/pricing";
import { Button } from "@/components/ui/button";
import { fetchApiDetails } from "@/lib/browse/get_api_details";
import { IconStarFilled, IconUsers } from "@tabler/icons-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@/lib/config";

export default async function Page({
    params
}: { params: Promise<{ slug: string }> }) {

    const slug = (await params).slug;
    if (!slug) {
        notFound();
    }
    const api = await fetchApiDetails(slug);
    const session = await getServerSession(authOptions);
    const authToken = !session ? undefined : jwt.sign({ id: session.user.id }, JWT_SECRET);

    return <div className="w-full my-8 px-8">
        <div className="flex md:flex-row md:justify-between md:items-center flex-col justify-center">

            <div className="flex items-center space-x-3">
                <img
                    src={api.thumbnail_url}
                    width={100}
                    height={100}
                    alt={`${api.title}'s thumbnail`}
                    className="p-4 bg-stone-100/90 dark:bg-stone-300/10 rounded-2xl"
                />
                <div className="flex flex-col space-y-0.5">
                    <h1 className="tracking-tight font-bold text-xl">{api.title}</h1>
                    <Link
                        className="w-fit text-xs text-stone-700 dark:text-stone-200 tracking-tighter bg-stone-300/60 dark:bg-stone-700/60 px-1.5 py-0.5 rounded-md"
                        href={`/?category_slug=${api.category_slug}`}
                    >
                        {api.category_name}
                    </Link>
                    <div className="flex flex-col space-y-0.5 space-x-0 md:flex-row md:space-x-2 md:space-y-0 tracking-tight text-stone-500 text-xs md:text-sm my-3 md:my-1">
                        <div className="flex space-x-1">
                            <IconStarFilled className="text-orange-400" size={20} />
                            <span>{Number(api.rating).toPrecision(3)}</span>
                            <span>({api.review_count})</span>
                        </div>
                        <div className="flex space-x-1">
                            <IconUsers size={20} />
                            <span>{api.subscribers}</span>
                            <span>Subscribers</span>
                        </div>
                    </div>
                </div>
            </div>
            <Button className="bg-stone-100 border-2 dark:bg-stone-400/30 dark:text-white">Open Playground</Button>

        </div>
        <div className="my-6">
            <h2 className="text-xl font-semibold">Descriptions</h2>
            <p className="text-stone-600 tracking-tight">{api.description}</p>
        </div>
        <Pricing api_slug={api.slug} authToken={authToken}/>
    </div>

}