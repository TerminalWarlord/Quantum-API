import { db } from "@repo/db/client";
import { RevenuePeriod } from "@repo/types";
import { sql } from "drizzle-orm";
import { PERIOD_SQL } from "./get_revenue";
import { formatTimeseriesData } from "./period_formatter";


export const INTERVAL_SQL = {
    [RevenuePeriod.HOUR]: sql`interval '48 hours'`,
    [RevenuePeriod.DAY]: sql`interval '30 days'`,
    [RevenuePeriod.MONTH]: sql`interval '12 months'`,
    [RevenuePeriod.YEAR]: sql`interval '5 years'`,
} as const;


export const PERIOD_TYPE_SQL = {
    [RevenuePeriod.HOUR]: sql`'hour'`,
    [RevenuePeriod.DAY]: sql`'hour'`,
    [RevenuePeriod.MONTH]: sql`'month'`,
    [RevenuePeriod.YEAR]: sql`'month'`,
} as const;

export async function getUsage({ period = RevenuePeriod.DAY }: { period: RevenuePeriod }) {
    const periodSql = PERIOD_SQL[period];
    const periodTypeSql = PERIOD_TYPE_SQL[period];
    const intervalSql = INTERVAL_SQL[period];
    const usage = await db.execute(sql`
        SELECT
            DATE_TRUNC(${periodSql},u.period_start) AS period,
            SUM(u.requests) AS requests
        FROM ${sql.identifier('usages')} AS u
        WHERE 
            u.period_start>=now()-${intervalSql}
            AND (u.period_type=${periodTypeSql})
        GROUP BY period
        ORDER BY period DESC;
    `);
    return {
        period,
        data: usage.rows.map(rev => {
            return {
                timestamp: rev.period,
                label: formatTimeseriesData(new Date(rev.period as any), period),
                value: Number(rev.usage) || 0
            }
        })
    };

}