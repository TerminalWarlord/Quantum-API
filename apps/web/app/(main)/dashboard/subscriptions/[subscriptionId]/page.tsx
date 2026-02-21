import UserSubscriptionDetails from "@/components/pages/user_subscriptions_details";

type PageProps = {
    params: Promise<{ subscriptionId: string }>
}
export default async function Page({ params }: PageProps) {
    const subscriptionId = (await params).subscriptionId;
    return <UserSubscriptionDetails subscriptionId={Number(subscriptionId)} />
}