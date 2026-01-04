import { RevenuePeriod } from "@repo/types";
import { PERIOD_SQL } from "./get_revenue";
import { db } from "@repo/db/client";
import { sql } from "drizzle-orm";
import { INTERVAL_SQL } from "./get_usage";
import { formatTimeseriesData } from "./period_formatter";


export const PERIOD_TYPE_SQL = {
    [RevenuePeriod.HOUR]: sql`'hour'`,
    [RevenuePeriod.DAY]: sql`'hour'`,
    [RevenuePeriod.MONTH]: sql`'day'`,
    [RevenuePeriod.YEAR]: sql`'day'`,
} as const;

export async function getFailedRequests(
    {
        period = RevenuePeriod.DAY,
    }:
        {
            period: RevenuePeriod,
        }
    ,) {
    const periodSql = PERIOD_SQL[period];
    const periodTypeSql = PERIOD_TYPE_SQL[period];
    const result = await db.execute(sql`
        SELECT
            DATE_TRUNC(${periodSql}, period_start) AS period,
            (SUM(count) FILTER (WHERE status_code>=400 AND status_code<=599)::float/SUM(count))::numeric(10,2) AS percentage
        FROM ${sql.identifier('status_code_usages')}
        WHERE 
            period_type=${periodTypeSql}
            AND period_start>=now()-${INTERVAL_SQL[period]}
        GROUP BY period
        ORDER BY period DESC;
    `);
    return {
        period,
        data: result.rows.map(row => {
            return {
                timestamp: row.period,
                label: formatTimeseriesData(new Date(row.period as any), period),
                value: Number(row.percentage) || 0
            }
        })
    }
}



export async function getAllRequests(
    {
        period = RevenuePeriod.DAY,
    }:
        {
            period: RevenuePeriod,
        }
    ,) {
    const periodSql = PERIOD_SQL[period];
    const periodTypeSql = PERIOD_TYPE_SQL[period];
    const result = await db.execute(sql`
        SELECT
            DATE_TRUNC(${periodSql}, period_start) AS period,
            SUM(count) AS count
        FROM ${sql.identifier('status_code_usages')}
        WHERE 
            period_type=${periodTypeSql}
            AND period_start>=now()-${INTERVAL_SQL[period]}
        GROUP BY period
        ORDER BY period DESC;
    `);
    return {
        period,
        data: result.rows.map(row => {
            return {
                timestamp: row.period,
                label: formatTimeseriesData(new Date(row.period as any), period),
                value: Number(row.count) || 0
            }
        })
    }
}