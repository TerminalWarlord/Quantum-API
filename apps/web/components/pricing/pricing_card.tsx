import { Plan } from "@repo/types";
import { Card } from "../ui/card";
import { cn } from "@/lib/utils";
import { IconCircleCheck, IconStarFilled } from "@tabler/icons-react";

export default function PricingCard({ plan, children }: { plan: Plan, children?: React.ReactNode }) {
    const roundedPrice = Math.floor(plan.price_in_cents / 100);
    const cents = Math.ceil((((plan.price_in_cents / 100) - Math.floor(plan.price_in_cents / 100)) * 100));
    return <Card className={cn(
        "min-w-64 p-4 h-fit gap-0",
        plan.is_recommended ? "border-2 border-cyan-400 shadow py-6 relative bg-linear-to-br from-cyan-50 dark:from-cyan-100/10 to-cyan-50/10" : ""
    )}>
        {plan.is_recommended === true && <p className="flex space-x-1 w-fit px-2.5 text-sm text-white rounded-xl bg-cyan-400 items-center justify-center absolute -top-3 left-1/2 -translate-x-1/2">
            <IconStarFilled className="w-3 h-3 font-bold" />
            <span>Recommended</span>
        </p>}
        <h4 className="text-lg font-medium">{plan.name}</h4>
        <p className="flex space-x-1 items-baseline py-2">
            <span className="text-3xl font-semibold tracking-tighter"> {roundedPrice}</span>
            <span className="text-stone-500 dark:text-neutral-400 ">.{cents}/month</span>
        </p>
        <div className="text-sm tracking-tight text-stone-600 dark:text-neutral-400 my-2 space-y-1">
            <div className="flex space-x-1 items-center ">
                <span><IconCircleCheck size={18} className="text-green-400" /></span>
                <p>{plan.rate_limit} requests/hour</p>
            </div>
            <div className="flex space-x-1 items-center ">
                <span><IconCircleCheck size={18} className="text-green-400" /></span>
                <p>{plan.monthly_requests} requests/month</p>
            </div>
        </div>
        <p className="text-sm my-1">{plan.features}</p>
        {children}
    </Card>
}