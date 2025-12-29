import { apiKeyTable, db } from "@repo/db/client";
import { Context } from "hono";
import { eq, sql } from "drizzle-orm";
import { sha256 } from "hono/utils/crypto";
import { checkAndIncrUsage } from "../../lib/proxy_helpers/check_and_update_usage";


export const proxyController = async (c: Context) => {
    const host = c.req.header('X-Quantum-Host');
    const api_key = c.req.header('X-Quantum-Key');

    if (!host || !api_key) {
        return c.json({
            message: "Missing api_key!"
        }, 403);
    }

    const incomingSHA256 = await sha256(api_key);
    if (!incomingSHA256) {
        return c.json({
            message: "Invalid API KEY!"
        }, 400);
    }
    const [apiKey] = await db.select().from(apiKeyTable)
        .where(eq(apiKeyTable.key_hash, incomingSHA256));

    if (!apiKey) {
        return c.json({
            message: "API KEY doesn't exist"
        }, 404);
    }
    // TODO: Create INDEX for api_keys (key_hash, subscription_id), subscriptions (api_id, plan_id)
    const results = await db.execute(sql`
        SELECT 
            s.status,
            a.base_url,
            p.monthly_requests,
            p.rate_limit,
            s.api_id,
            s.plan_id
        FROM api_keys AS ak
        JOIN subscriptions AS s
            ON s.id=ak.subscription_id
        JOIN apis AS a
            ON a.id=s.api_id
        JOIN plans as p
            ON p.id=s.plan_id
        WHERE ak.key_hash=${incomingSHA256};
    `)
    if (!results || results.rowCount == 0) {
        return c.json({
            message: "Failed to get subscription status!"
        }, 403);
    }
    const info: {
        status: string,
        base_url: string
        monthly_requests: string
        rate_limit: string
        api_id: number
        plan_id: number
    } = results.rows[0] as any;

    if (info.status != "active") {
        return c.json({
            message: "Subscription is currently not active"
        }, 403);
    }
    const usage = await checkAndIncrUsage({
        api_id: info.api_id,
        api_key: api_key,
        metric: "requests",
        monthly_requests: Number(info.monthly_requests),
        rate_limit: Number(info.rate_limit)
    });

    if (!usage.allowed) {
        return c.json({
            message: "Too many requests"
        }, 429);
    }

    const url = new URL(c.req.url);
    const targetUrl = info.base_url + url.pathname.replace('/proxy', '') + url.search;

    try {
        const res = await fetch(targetUrl, {
            method: c.req.method,
            headers: c.req.raw.headers,
            body: ['GET', 'HEAD'].includes(c.req.method)
                ? undefined
                : c.req.raw.body,
        })
        if (!res.ok) {
            return new Response(res.body, {
                status: res.status,
                headers: res.headers,
            });
        }
        return res;
    }
    catch (err: any) {
        console.log(err)
        return c.json({
            message: "Upstream connection failed",
            error: err.code ?? "FETCH_ERROR",
            details: err.message,
        }, 502);
    }


}