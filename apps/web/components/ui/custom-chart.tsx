"use client";
import { BACKEND_URL } from '@/lib/config';
import { useState } from 'react'
import { toast } from 'sonner';
import useSWR from 'swr';
import { ChartAreaDefault } from '../ui/chart_area';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { CardDescription, CardHeader, CardTitle } from '../ui/card';
import { createToken } from '@/lib/create_token';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';



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

const fetcher = async ([url, session, period]: [url: string, session: Session | null, period: Period]) => {
    try {
        if (!session || !session.user.id) return;
        const token = await createToken(session);
        const res = await fetch(url, {
            headers: {
                "Authorization": "Bearer " + token,
                "Content-Type": "application/json"
            }
        });
        const resData = await res.json();
        if (!res.ok) {
            toast.error(resData.error || resData.message || "Failed to fetch revenue data!");
            throw new Error(resData.error || resData.message || "Failed to fetch revenue data!");
        }
        const data = resData.results.filter((rev: PeriodData) => rev.period === period);
        return data[0].data;
    }
    catch (err: any) {
        console.log(err);
        toast.error(err.message || "Failed to load Graph");
        // throw new Error("Failed to load Graph");
    }
}

const CustomChart = ({
    url,
    title,
    description,
    valuePrefix

}: {
    url: string,
    title: string,
    description: string,
    valuePrefix?: string,
}) => {
    const [currentPeriod, setCurrentPeriod] = useState(Period.hour);
    const session = useSession();
    const { data, isLoading, error } = useSWR([url, session.data, currentPeriod], fetcher)

    return (
        <ChartAreaDefault
            chartData={data}
            isLoading={isLoading}
            error={error}
            valuePrefix={valuePrefix}
        >
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

export default CustomChart;