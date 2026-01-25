"use client";

import { BACKEND_URL } from "@/lib/config";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { EndpointMethod, ParameterLocation, ParameterResponse, ParameterType } from "@repo/types"
import { Loader2 } from "lucide-react";
import { METHOD_COLORS } from "./playground_sidebar";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IconBug, IconHelpHexagon, IconPlayerPlayFilled } from "@tabler/icons-react";
import PlaygroundResponseTab from "./playground_response";
import { useRequestStore } from "@/stores/request_store";
import PlaygroundParams from "./playground_params";
import PlaygroundBody from "./playground_body";
import PlaygroundHeader from "./playground_header";
import { useSession } from "next-auth/react";




const fetcher = async ([url, endpointId]: [url: string, endpointId: string]) => {
    if (!endpointId) {
        toast.warning("Select an endpoint to use the playground");
        return;
    }
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to get parameters");
        }
        return resData as ParameterResponse
    }
    catch (err: any) {
        console.log(err.message)
        toast.error(err.message || "Failed to get parameters");
    }

}
export default function PlaygroundTabs() {
    const [currentTab, setCurrentTab] = useState(ParameterLocation.QUERY);
    const session = useSession();
    const searchParams = useSearchParams();
    const sendRequest = useRequestStore(s => s.sendRequests);
    const selectedHeaderApiKey = useRequestStore(s => s.selectedHeaderApiKey);
    const endpointId = searchParams.get('endpoint_id');
    const { data, isLoading, error } = useSWR([`${BACKEND_URL}/parameters?endpoint_id=${endpointId}`, endpointId], fetcher);
    const updateBody = useRequestStore(s => s.updateBody);

    useEffect(() => {
        setCurrentTab(ParameterLocation.QUERY);
    }, [endpointId]);

    useEffect(() => {
        if (!data || !data.results.length) return;
        const body = data.results.filter(p => p.location === ParameterLocation.BODY) ?? [];
        if (body.length) {
            updateBody(body[0].default_value);
        }
    }, [data])

    if (error) {
        return <div className="text-center w-full h-7/12 flex space-y-5 flex-col items-center justify-center">
            <IconBug className="w-15 h-15" />
            <p className="text-xl font-medium">Failed to fetch data! </p>
        </div>
    }
    if (!endpointId) {
        return <div className="text-center w-full h-7/12 flex space-y-5 flex-col items-center justify-center">
            <IconHelpHexagon className="w-15 h-15" />
            <p className="text-xl font-medium">Select an endpoint to use the playground </p>
        </div>
    }

    if (isLoading) {
        return <div className="flex items-center justify-center w-full  h-8/12">
            <Loader2 className="animate-spin" />
        </div>
    }
    console.log(endpointId);
    const parameters = data && data.results ? data.results.filter(d => d.location === ParameterLocation.QUERY) : [];


    return <div className="flex flex-col md:flex-row w-full px-4 md:px-8 space-y-8 md:space-y-0 space-x-0 md:space-x-4">
        <div className="w-full md:w-2/3 overflow-clip">
            <ul className="flex items-baseline px-0 sm:px-2 md:px-8 text-center text-black dark:text-stone-100 border-b border-t box-border">
                <li>
                    <button
                        onClick={() => setCurrentTab(ParameterLocation.QUERY)}
                        className={`${currentTab === ParameterLocation.QUERY ? "border-cyan-400" : "border-transparent"} px-2 md:px-3 lg:px-4 border-b-4 py-2 transform transition-all duration-150 ease-in cursor-pointer text-sm md:text-md lg:text-base`}
                    >Params</button>
                </li>
                <li>
                    <button
                        disabled={data && data.results && data.method === EndpointMethod.GET}
                        onClick={() => setCurrentTab(ParameterLocation.BODY)}
                        className={`${currentTab === ParameterLocation.BODY ? "border-cyan-400" : "border-transparent"} px-2 md:px-3 lg:px-4 border-b-4 py-2 transform transition-all duration-150 ease-in disabled:text-black/10 dark:disabled:text-stone-50/20 cursor-pointer disabled:cursor-not-allowed text-sm md:text-md lg:text-base`}
                    >Body</button>
                </li>
                <li>
                    <button
                        onClick={() => setCurrentTab(ParameterLocation.HEADER)}
                        className={`${currentTab === ParameterLocation.HEADER ? "border-cyan-400" : "border-transparent"} px-2 md:px-3 lg:px-4 border-b-4 py-2 transform transition-all duration-150 ease-in cursor-pointer text-sm md:text-md lg:text-base`}
                    >Headers</button>
                </li>
            </ul>
            <div className="flex items-center justify-start my-2">
                <div className="px-2 py-0.5 bg-cyan-50/50 dark:bg-neutral-600/40 border border-cyan-200 rounded-md w-full flex items-center ">
                    <p className={cn("text-[0.6rem] h-fit", METHOD_COLORS[data?.method as EndpointMethod])}>{data?.method}</p>
                    <p className="text-center text-sm px-1.5 py-0.5 text-stone-600  dark:text-stone-300">{data?.path}</p>
                </div>
            </div>
            <h2 className="text-stone-700 dark:text-stone-300 tracking-tight mt-4 mb-8 text-sm">{data?.description}</h2>

            {currentTab === ParameterLocation.QUERY && parameters.length > 0 && <PlaygroundParams parameters={parameters} />}
            {currentTab === ParameterLocation.BODY && <PlaygroundBody data={data?.results || []} />}
            {/* </div> */}
            {/* {JSON.stringify(data)} */}

            {currentTab === ParameterLocation.HEADER && <PlaygroundHeader />}
            <Button
                onClick={async () => {
                    try {
                        if (!data) return;
                        if (!session || !session.data?.user.id) {
                            throw new Error("Please login to use the playground!");
                        }
                        if (!selectedHeaderApiKey) {
                            throw new Error("You must have a subscription plan selected from the Headers tab");
                        }

                        const tokenRes = await fetch('/api/token', {
                            method: "POST",
                            body: JSON.stringify({
                                api_key_id: parseInt(selectedHeaderApiKey!)
                            })
                        })
                        if (!tokenRes.ok) {
                            toast.error("Failed to generate token!");
                            return;
                        }
                        const { token } = await tokenRes.json();
                        await sendRequest(
                            data.path,
                            data.method,
                            token
                        )
                    }
                    catch (err: any) {
                        toast.error(err.message || "Failed to send request!");
                        return;
                    }
                }}
                className="bg-cyan-400 hover:bg-cyan-500/95 cursor-pointer text-white my-8"
            >
                <IconPlayerPlayFilled />
                <p>Send Request</p>
            </Button>
        </div>
        <div className="h-fit">
            <PlaygroundResponseTab
                sampleResponse={data?.sample_response}
            />
        </div>

    </div>
}