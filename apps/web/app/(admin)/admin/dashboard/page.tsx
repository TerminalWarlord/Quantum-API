import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { BACKEND_URL, JWT_SECRET } from "@/lib/config";
import { getServerSession } from "next-auth"
import jwt from "jsonwebtoken";
import { Card } from "@/components/ui/card";
import { IconActivity, IconCurrencyDollar, IconPackage, IconUsers } from "@tabler/icons-react";
import { ChartAreaDefault } from "@/components/ui/chart_area";
import RevenueGraph from "@/components/admin_dashboard/revenue";
import Unauthorized from "@/components/ui/unauthorized";
import Dashboard_Card from "@/components/ui/dashboard_card";
import { DashboardOverview } from "@repo/types";

async function getOverview(id: number) {
    try {
        const res = await fetch(`${BACKEND_URL}/admin/overview`, {
            headers: {
                'Authorization': `Bearer ${jwt.sign({ id }, JWT_SECRET)}`
            }
        });
        if (res.status === 401) {
            throw new Error("Unauthorized");
        }
        else if (res.status === 403) {
            throw new Error("Forbidden");
        }
        const resData = await res.json();
        if (!res.ok) {
            throw new Error(resData.error || resData.message || "Failed to fetch data");
        }
        return resData as DashboardOverview
    }
    catch (err: any) {
        console.log(err);
        throw new Error(err.message || "Failed to fetch data");
    }
}

export default async function Page() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return <Unauthorized />
    }
    const dashboard = await getOverview(session.user.id);

    const authToken = jwt.sign({ id: session.user.id }, JWT_SECRET);
    return (
        <div className="flex w-full min-w-0">
            {/* sidebar */}
            <div className="w-full flex-1" style={{ fontFamily: "var(--font-poppins)" }}>
                <div className="grid grid-cols-2 lg:grid-cols-4 w-full gap-4 px-6 py-2">

                    <Dashboard_Card
                        title="Total APIs"
                        value={dashboard.total_apis.toString()}
                        icon={IconPackage}
                    />
                    <Dashboard_Card
                        title="Active Subcribers"
                        value={dashboard.active_subscribers.toString()}
                        icon={IconUsers}
                    />
                    <Dashboard_Card
                        title="Monthly Revenue"
                        value={dashboard.active_subscribers.toString()}
                        icon={IconCurrencyDollar}
                    />
                    <Dashboard_Card
                        title="API requests"
                        value={dashboard.api_calls.toString()}
                        icon={IconActivity}
                    />


                </div>
                <div className="px-6 py-2 grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <RevenueGraph
                        authToken={authToken}
                        title={'Revenue Overview'}
                        description="Platform revenue over time"
                    />
                    <RevenueGraph
                        authToken={authToken}
                        title={'Revenue Overview'}
                        description="Platform revenue over time"
                    />
                </div>

            </div>
        </div >
    )
}
