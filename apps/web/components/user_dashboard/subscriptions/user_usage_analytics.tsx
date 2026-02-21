import CustomChart from "@/components/ui/custom-chart";
import { TabsContent } from "@/components/ui/tabs";
import { BACKEND_URL } from "@/lib/config";

type UserUsageAnalyticsProps = {
    subscriptionId: number
}
export default function UserUsageAnalytics({ subscriptionId }: UserUsageAnalyticsProps) {
    return <TabsContent value="analytics"  className="flex flex-col space-y-4 my-2">
        <CustomChart
            url={`${BACKEND_URL}/manage/subscriptions/usage/${subscriptionId}`}
            title="User Usage"
            description="API Usage over time"
        />
    </TabsContent>
}