"use client";
import { BACKEND_URL } from '@/lib/config';
import { useState } from 'react'
import { toast } from 'sonner';
import useSWR from 'swr';
import { ChartAreaDefault } from '../ui/chart_area';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from '../ui/skeleton';



enum Period {
    hour = "hour",
    day = "day",
    month = "month",
    year = "year",
}
interface PeriodData {
    period: Period;
    data: {
        timestamp: Date;
        label: string;
        value: number;
    }[]
}

const fetcher = async ([url, authToken, period]: [url: string, authToken: string, period: Period]) => {
    try {
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + authToken,
                "Content-Type": "application/json"
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            toast.error(resData.error || resData.message || "Failed to fetch revenue data!");
            throw new Error(resData.error || resData.message || "Failed to fetch revenue data!");
        }
        const data = resData.revenue.filter((rev: PeriodData) => rev.period === period);
        return data[0].data;
    }
    catch (err) {
        toast.error("Failed to load Graph");
        throw new Error("Failed to load Graph");
    }
}

const RevenueGraph = ({
    authToken,
    title,
    description,

}: {
    authToken: string,
    title: string,
    description: string,
}) => {
    const [currentPeriod, setCurrentPeriod] = useState(Period.hour);
    const { data, isLoading, error } = useSWR([`${BACKEND_URL}/admin/overview/revenue`, authToken, currentPeriod], fetcher)

    return (
        <ChartAreaDefault chartData={data} isLoading={isLoading} error={error}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle>{title}</CardTitle>
                    <CardDescription>{description}</CardDescription>
                </div>
                <Tabs value={currentPeriod} onValueChange={(val) => { setCurrentPeriod(val as Period) }}>
                    <TabsList className="h-8">
                        <TabsTrigger value="hour" className="text-xs px-2">Hourly</TabsTrigger>
                        <TabsTrigger value="day" className="text-xs px-2">Daily</TabsTrigger>
                        <TabsTrigger value="month" className="text-xs px-2">Monthly</TabsTrigger>
                        <TabsTrigger value="year" className="text-xs px-2">Yearly</TabsTrigger>
                    </TabsList>
                </Tabs>
            </CardHeader>
        </ChartAreaDefault>
    )
}

export default RevenueGraph;