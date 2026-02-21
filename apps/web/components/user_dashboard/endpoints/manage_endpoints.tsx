"use client";


import PageInfo from "../page_info";
import { IconCurrencyDollar, IconEdit, IconPlus } from "@tabler/icons-react";
import { Input } from "../../ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "../../ui/input-group";
import { Label } from "../../ui/label";
import { Field, FieldLabel } from "../../ui/field";
import { Textarea } from "../../ui/textarea";
import { Switch } from "../../ui/switch";
import { Button } from "../../ui/button";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { FormEvent } from "react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Endpoint, Plan } from "@repo/types";
import useSWR from "swr";
import PricingCard from "@/components/pricing/pricing_card";
import { cn } from "@/lib/utils";
import Loading from "@/components/ui/loading";
import EndpointCard from "./endpoint_card";
import AddEndpoint from "./actions/add_endpoint";


const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch pricing");
        }
        return resData.results as Endpoint[];
    }
    catch (err: any) {
        toast.error(err.message || "Failed to fetch pricing");
        throw new Error(err.message || "Failed to fetch pricing");
    }
}

// TODO: DELETE subscription of user when an API or PLAN is deleted
export default function ManageEndpoints({ apiSlug }: { apiSlug: string }) {
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/endpoints?api_slug=${apiSlug}`, fetcher);


    return <div className="px-4 md:px-8 py-6 mb-16">
        <PageInfo title="Manage Endpoints" description="Configure API endpoints" />
        <div className="flex items-center justify-end mb-4">
            <AddEndpoint apiSlug={apiSlug} />
        </div>
        {isLoading && <Loading />}
        <div className="flex flex-col space-y-3">
            {data && data.length > 0 && data.map(endpoint => {
                return <EndpointCard key={endpoint.id} endpoint={endpoint} />
            })}
        </div>

    </div>
}