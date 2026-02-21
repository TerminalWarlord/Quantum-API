import { METHOD_COLORS } from "@/components/playground/playground_sidebar";
import { Card } from "@/components/ui/card";

import { cn } from "@/lib/utils";
import { Endpoint, EndpointMethod, Parameter, ParameterLocation, ParameterResponse } from "@repo/types";
import { IconArrowRight, IconChevronDown, IconChevronRight, IconDotsVertical } from "@tabler/icons-react";
import { useState } from "react";
import useSWR from "swr";
import { BACKEND_URL } from "@/lib/config";
import EndpointBody from "./endpoint_body";
import EndpointSampleResponse from "./endpoint_sample_response";
import EndpointParamsCard from "./endpoint_params_card";
import EditEndpoint from "./actions/edit_endpoint";
import DeleteEndpoint from "./actions/delete_endpoint";


type EndpointCardProps = {
    endpoint: Endpoint
}
const fetcher = async (url: string) => {
    const res = await fetch(url);
    const resData = await res.json();
    if (!res.ok) {
        throw new Error(resData.message || "Failed to fetch parameters");
    }
    return resData as ParameterResponse;
}

export default function EndpointCard({ endpoint }: EndpointCardProps) {
    const { data: paramData, isLoading, error } = useSWR(`${BACKEND_URL}/parameters?endpoint_id=${endpoint.id}`, fetcher);

    const params = paramData && paramData.results.length ? paramData.results.filter(p => p.location === ParameterLocation.QUERY) : [];
    const body = paramData && paramData.results.length ? paramData.results.filter(p => p.location === ParameterLocation.BODY) : [];

    const [isExpanded, setIsExpanded] = useState(false);
    return <Card className="gap-0 p-4">
        <div className="flex flex-col space-y-2">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between space-x-2">
                <div className="flex flex-col md:flex-row md:items-center space-x-2">
                    <div className="flex space-x-1 items-center">
                        <div
                            onClick={() => setIsExpanded(prev => !prev)}
                            className="cursor-pointer"
                        >
                            <IconChevronRight
                                className={`w-5 h-5 transform transition-transform duration-300 ease-in-out ${isExpanded ? "rotate-90" : "rotate-0"
                                    }`}
                            />
                        </div>
                        <p className={cn(
                            "border px-1 text-xs rounded-md w-fit h-fit",
                            METHOD_COLORS[endpoint.method]
                        )}>{endpoint.method}</p>
                        <p className="font-mono text-sm text-neutral-600">{endpoint.path}</p>
                    </div>
                    <h1 className="font-medium">{endpoint.title}</h1>
                </div>
                <div className="flex">
                    <EditEndpoint endpoint={{...endpoint, sample_response: paramData?.sample_response}}/>
                    <DeleteEndpoint endpoint_id={endpoint.id}/>
                </div>
            </div>
            <div>
                <p className="text-neutral-500 text-sm">{endpoint.description}</p>
            </div>
            <div
                className={`grid transition-[grid-template-rows] duration-500 ease-in-out ${isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                    }`}
            >
                <div className="overflow-hidden flex flex-col space-y-1">
                    {/* params */}
                    <EndpointParamsCard isExpanded={isExpanded} params={params} endpoint={endpoint} />
                    {endpoint.method !== EndpointMethod.GET &&
                        <EndpointBody
                            body={body && body.length > 0 ? body[0] : undefined}
                            endpoint_id={endpoint.id}
                        />}
                    <EndpointSampleResponse endpoint={{ ...endpoint, sample_response: paramData?.sample_response }} />
                </div>
            </div>
        </div>
    </Card >
}