"use client"

import { Loader2, TrendingUp } from "lucide-react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { cn } from "@/lib/utils"
import { ReactNode } from "react"
import { Skeleton } from "./skeleton"
import { IconExclamationCircle } from "@tabler/icons-react"

export const description = "A simple area chart"

// const chartData = [
//   { month: "January", desktop: 186 },
//   { month: "February", desktop: 305 },
//   { month: "March", desktop: 237 },
//   { month: "April", desktop: 73 },
//   { month: "May", desktop: 209 },
//   { month: "June", desktop: 214 },
// ]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaDefault({ chartData, children, isLoading, error }: {
  chartData: { label: string, value: number }[],
  isLoading: boolean,
  error: Error,
  children: ReactNode
}) {
  if (error) {
    return <Card className="px-3 flex items-center justify-center gap-2 py-6">
      <IconExclamationCircle size={30}/>
      {error.message}
    </Card>
  }
  return <div className="grid gap-6 lg:grid-cols-1">
    <Card>
      {children}
      {isLoading ? <div className='w-full flex items-center justify-center h-75'>
        <Loader2 className="animate-spin" />
      </div> : <CardContent>
        <ChartContainer config={chartConfig} className="h-75 w-full">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(var(--color-desktop))"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(var(--color-desktop))"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              className="text-muted-foreground"
            />
            <YAxis
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${(value / 100).toFixed(0)}`}
              className="text-muted-foreground"
            />
            <ChartTooltip
              content={<ChartTooltipContent formatter={(value) => {
                const valueInUsd = (Number(value) / 100).toPrecision(3);
                return `$${valueInUsd.toLocaleString()}`;
              }} />}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--color-desktop))"
              strokeWidth={2}
              fill="url(#revenueGradient)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>}
    </Card>
  </div>
}
