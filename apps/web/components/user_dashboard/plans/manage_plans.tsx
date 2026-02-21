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
import { Plan } from "@repo/types";
import useSWR from "swr";
import CreatePlan from "./create_plan";
import PricingCard from "@/components/pricing/pricing_card";
import { cn } from "@/lib/utils";
import EditPlan from "./edit_plan";
import Loading from "@/components/ui/loading";


const fetcher = async (url: string) => {
    try {
        const res = await fetch(url);
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch pricing");
        }
        return resData.results as Plan[];
    }
    catch (err: any) {
        toast.error(err.message || "Failed to fetch pricing");
        throw new Error(err.message || "Failed to fetch pricing");
    }
}

// TODO: DELETE subscription of user when an API or PLAN is deleted
export default function ManagePlans({ apiSlug }: { apiSlug: string }) {
    const { data, isLoading, error } = useSWR(`${BACKEND_URL}/plans?api_slug=${apiSlug}`, fetcher);


    return <div className="px-4 md:px-8 py-6 mb-16">
        <PageInfo title="Manage Plans" description="Configure pricing tiers for your API" />
        <CreatePlan apiSlug={apiSlug} />
        {isLoading && <Loading />}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data && data.length > 0 && data.map(plan => {
                return <PricingCard plan={plan}>
                    <EditPlan plan={plan} />
                </PricingCard>
            })}
        </div>
    </div>
}