import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { SubscriptionStatusEnums, UserSubscription } from "@repo/types";
import { IconCircleX, IconPlayerPause } from "@tabler/icons-react";
import CancelSubscription from "./cancel_subscription";

type ManageSubscriptionProps = {
    subscription: UserSubscription
}
export default function ManageSubscription({ subscription }: ManageSubscriptionProps) {
    return <TabsContent value="manage_subscription" className="flex flex-col space-y-4 my-2">
        <Card className="gap-0 p-6 w-full">
            <div>
                <h1 className="text-lg font-bold">Subscription Status</h1>
                <div className="flex space-x-1 items-center w-full">
                    <p className="text-neutral-600 text-sm">Current status:</p>
                    <p
                        className={cn(
                            "border text-[0.6rem] px-1 w-fit h-fit rounded-md font-medium",
                            subscription.status === SubscriptionStatusEnums.active ? "bg-green-300/10  border-green-300 text-green-700/50 dark:text-green-300 dark:bg-green-300/20" : "bg-red-300/10  border-red-300 text-red-700/50"
                        )}
                    >
                        {subscription.status.toLocaleUpperCase()}
                    </p>
                </div>

                <div className="flex space-x-4 mt-6 items-center justify-center">
                    <div className="w-1/2 py-5 bg-neutral-50 dark:bg-neutral-50/10 rounded-md flex flex-col  px-4 justify-center">
                        <p className="text-sm text-neutral-500">Current Period Start</p>
                        <p className="font-medium">{new Date(subscription.current_period_start).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric"

                        })}</p>
                    </div>
                    <div className="w-1/2 py-5 bg-neutral-50 dark:bg-neutral-50/10 rounded-md flex flex-col  px-4 justify-center">
                        <p className="text-sm text-neutral-500">Current Period End</p>
                        <p className="font-medium">{new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                            month: "short",
                            day: "2-digit",
                            year: "numeric"

                        })}</p>
                    </div>
                </div>
            </div>
        </Card>
        <Card className="gap-0 p-6 w-full">
            <div>
                <h1 className="text-lg font-bold">Subscription Actions</h1>
                <div className="flex space-x-1 items-center w-full">
                    <p className="text-neutral-600 text-sm">Manage your subscription status</p>
                </div>

                <div className="grid  grid-cols-1 gap-3 mt-4">
                    {subscription.provider_data && subscription.provider_data.action === "cancel" ? <p className="flex items-center justify-center space-x-4 border border-red-500 p-3 text-sm text-neutral-800 dark:text-neutral-300 rounded-md bg-red-100 dark:bg-red-400/10">
                        <span><IconCircleX className="w-6 h-6"/></span>
                        <span>
                            Your subscription has been cancelled. Access will end on {new Date(subscription.provider_data.effective_at).toLocaleDateString("en-US", {
                                month: "short",
                                day: "2-digit",
                                year: "numeric"
                            })}. To resubscribe, visit the API page and select a new plan.
                        </span>
                    </p> : <CancelSubscription subscription_id={subscription.subscription_id} />}

                </div>


            </div>
        </Card>
    </TabsContent>
}