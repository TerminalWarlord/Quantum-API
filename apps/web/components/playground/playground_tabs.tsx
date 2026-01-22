"use client";

import { BACKEND_URL } from "@/lib/config";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import useSWR from "swr";
import { EndpointMethod, ParameterLocation, ParameterResponse, ParameterType } from "@repo/types"
import { CheckCircle2, Loader2 } from "lucide-react";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";
import { METHOD_COLORS } from "./playground_sidebar_old";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { IconCircleCheck, IconCircleCheckFilled, IconCircleX, IconCircleXFilled, IconPlayerPlayFilled } from "@tabler/icons-react";
import PlaygroundResponseTab from "./playground_response";


const checkJsonValidity = (value: string) => {
    try {
        const val = JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
}

const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to get parameters");
        }
        return resData as ParameterResponse
    }
    catch (err: any) {
        toast.error(err.message || "Failed to get parameters");
    }

}
export default function PlaygroundTabs() {
    const [currentTab, setCurrentTab] = useState(ParameterLocation.QUERY);
    const [bodyInput, setBodyInput] = useState<string | null>(null);
    const [isJsonValid, setIsJsonValid] = useState(true);
    const searchParams = useSearchParams();
    const endpointId = searchParams.get('endpoint_id');
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/parameters?endpoint_id=${endpointId}`, fetcher);


    const body = data?.results?.filter(p => p.location === ParameterLocation.BODY) ?? [];

    useEffect(() => {
        setCurrentTab(ParameterLocation.QUERY);
        setBodyInput(null);
        setIsJsonValid(true);
    }, [endpointId]);

    useEffect(() => {
        if (!bodyInput && body.length > 0) {
            try {
                const formatted = JSON.stringify(
                    JSON.parse(body[0].default_value),
                    null,
                    2
                );
                setIsJsonValid(checkJsonValidity(formatted));
                setBodyInput(formatted);
            } catch {
                setIsJsonValid(checkJsonValidity(body[0].default_value));
                setBodyInput(body[0].default_value);
            }
        }
    }, [body, bodyInput]);

    if (isLoading) {
        return <div className="flex items-center justify-center">
            <Loader2 className="animate-spin" />
        </div>
    }
    console.log(endpointId);
    const parameters = data && data.results ? data.results.filter(d => d.location === ParameterLocation.QUERY) : [];

    const bodyEditor = (
        <div className="relative">
            <div className="bg-muted/50 rounded-lg border overflow-hidden">
                <div className="flex">
                    {/* line numbers */}
                    <div className="w-10 py-3 text-right pr-3 text-xs text-muted-foreground font-mono select-none border-r bg-muted/30">
                        {(bodyInput ?? "{\n  \n}")
                            .split("\n")
                            .map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                    </div>

                    {/* textarea */}
                    <textarea
                        value={bodyInput ?? "{\n  \n}"}
                        onChange={(e) => {
                            setBodyInput(e.target.value);
                            setIsJsonValid(checkJsonValidity(e.target.value));
                        }}
                        className="
                        flex-1
                        bg-transparent
                        p-3
                        font-mono
                        text-sm
                        resize-none
                        focus:outline-none
                        min-h-50
                        whitespace-pre
                        leading-relaxed
                        "
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {isJsonValid ? <>
                    <IconCircleCheckFilled className="h-5 w-5 text-emerald-500" />
                    Valid Body
                </> : <>
                    <IconCircleXFilled className="h-5 w-5 text-red-500" />
                    Invalid Body
                </>}
            </div>
        </div>
    );

    const paramComp = <div>
        <h3 className="text-md font-semibold my-2">Parameters</h3>
        <div className="border rounded-md">
            {parameters && parameters.length > 0 && parameters.map((p, idx) => {
                return <div
                    style={{ fontFamily: "var(--font-poppins)" }}
                    className="pb-2"
                >
                    <div className="px-4">
                        <div className="flex space-x-1 items-baseline my-2 ">
                            <p className="text-sm">{p.name}</p>
                            {p.is_required && <p className="text-[0.6rem] bg-red-500 px-1  rounded-lg text-white mx-0.5">required</p>}
                        </div>
                        <Input type="text" placeholder={p.default_value} value={p.default_value} />
                    </div>
                    {idx !== parameters.length - 1 && <Separator className="mt-4" />}
                </div>
            })}
        </div>
    </div>
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

            {currentTab === ParameterLocation.QUERY && parameters.length > 0 && paramComp}
            {currentTab === ParameterLocation.BODY && bodyInput && bodyEditor}
            {/* </div> */}
            {/* {JSON.stringify(data)} */}
            <Button className="bg-cyan-400 hover:bg-cyan-500/95 cursor-pointer text-white my-8">
                <IconPlayerPlayFilled />
                <p>Send Request</p>
            </Button>
        </div>
        <PlaygroundResponseTab
            sampleResponse={data?.sample_response}
        />

    </div>
}