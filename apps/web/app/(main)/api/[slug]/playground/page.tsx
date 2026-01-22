import { PlaygroundSidebar } from '@/components/playground/playground_sidebar'
import PlaygroundTabs from '@/components/playground/playground_tabs'
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar'
import { BACKEND_URL } from '@/lib/config'
import { EndpointResponse } from '@repo/types'

async function getEndpoints(apiSlug: string) {
    try {
        const res = await fetch(`${BACKEND_URL}/endpoints?api_slug=${apiSlug}`);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch endpoints");
        }
        return resData.results as EndpointResponse[];
    }
    catch (err: any) {
        throw new Error(err.message || "Failed to fetch endpoints");
    }
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
    // TODO: user must subscribe before using playground
    const slug = (await params).slug;
    console.log(slug);
    const endpoints = await getEndpoints(slug);
    console.log(endpoints);
    return (
        <div className="flex min-h-screen w-full">
            <PlaygroundSidebar endpoints={endpoints} />

            <SidebarInset className="flex-1 min-w-0">
                <header className="p-2">
                    <SidebarTrigger />
                </header>
                {/* {JSON.stringify(endpoints)} */}
                <div className='flex flex-col md:flex-row'>
                    {/* <div className=''> */}
                    <PlaygroundTabs />
                    {/* </div> */}
                    {/* <div className='flex-1 bg-amber-200'></div> */}
                </div>

            </SidebarInset>
        </div>
    )
}
