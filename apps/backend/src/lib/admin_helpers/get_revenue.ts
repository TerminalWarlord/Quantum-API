import { db } from "@repo/db/client";
import { RevenuePeriod } from "@repo/types";
import { sql } from "drizzle-orm";
import { formatTimeseriesData } from "./period_formatter";


export const PERIOD_SQL = {
    [RevenuePeriod.HOUR]: sql`'hour'`,
    [RevenuePeriod.DAY]: sql`'day'`,
    [RevenuePeriod.MONTH]: sql`'month'`,
    [RevenuePeriod.YEAR]: sql`'year'`,
} as const;

export async function getRevenue(
    {
        period = RevenuePeriod.DAY,
    }:
        {
            period: RevenuePeriod,
        }
    ,) {
    const periodSql = PERIOD_SQL[period];
    const revenue = await db.execute(sql`
        SELECT
            date_trunc(${periodSql}, t.created_at) AS period,
            SUM(t.amount_in_cents) AS revenue
        FROM ${sql.identifier("transactions")} AS t
        GROUP BY period
        ORDER BY period DESC;
    `);
    return {
        period,
        data: revenue.rows.map(rev => {
            return {
                timestamp: rev.period,
                label: formatTimeseriesData(new Date(rev.period as any), period),
                value: Number(rev.revenue) || 0
            }
        })
    };
}


// FORMAT
// {
//   "period": "day",
//   "data": [
//     {
//       "timestamp": "2026-01-15T00:00:00Z",
//       "label": "2026-01-15",
//       "value": 1823
//     }
//   ]
// }