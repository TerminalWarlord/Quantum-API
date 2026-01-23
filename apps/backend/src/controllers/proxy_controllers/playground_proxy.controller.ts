import { apiKeyTable, db, sql, eq } from "@repo/db/client";
import { sha256 } from "hono/utils/crypto";
import { checkAndIncrUsage } from "../../lib/proxy_helpers/check_and_update_usage";
import { updateStatusCodeUsage } from "../../lib/admin_helpers/update_status_code_usage";
import { Context } from "hono";
import jwt from "jsonwebtoken";


const JWT_SECRET = process.env.JWT_SECRET || "";

export const playgroundProxyController = async (c: Context) => {
    console.log("REACHED playground")
    // TODO: add host
    // const host = c.req.header('X-Quantum-Host');
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.includes('Bearer ')) {
        return c.json({
            message: "Forbidden"
        }, 403);
    }
    try {

        const payload = jwt.verify(authHeader.replace("Bearer ", ""), JWT_SECRET) as { api_key_id: number};

        if (!payload || !payload.api_key_id) {
            return c.json({
                message: "Forbidden",
                error: "Missing auth header"
            }, 403);
        }

        const [apiKey] = await db.select().from(apiKeyTable)
            .where(eq(apiKeyTable.id, payload.api_key_id));

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
            s.id AS subscription_id,
            s.api_id
        FROM api_keys AS ak
        JOIN subscriptions AS s
            ON s.id=ak.subscription_id
        JOIN apis AS a
            ON a.id=s.api_id
        JOIN plans AS p
            ON p.id=s.plan_id
        WHERE ak.id=${payload.api_key_id};
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
            subscription_id: number,
            api_id: number
        } = results.rows[0] as any;

        if (info.status != "active") {
            return c.json({
                message: "Subscription is currently not active"
            }, 403);
        }
        const usage = await checkAndIncrUsage({
            subscription_id: info.subscription_id,
            metric: "requests",
            monthly_requests: Number(info.monthly_requests),
            rate_limit: Number(info.rate_limit)
        });

        if (!usage.allowed) {
            await updateStatusCodeUsage({
                subscription_id: info.subscription_id,
                api_id: info.api_id,
                status_code: 429
            });
            return c.json({
                message: "Too many requests"
            }, 429);
        }

        const url = new URL(c.req.url);
        const incomingHeaders = new Headers(c.req.raw.headers);
        // TODO: Undertand more about Headers
        // This was causing some bug, sanitize the headers
        [
            "host",
            "content-length",
            "connection",
            "accept-encoding",
            "transfer-encoding",
            "origin",
            "referer",
        ].forEach(h => incomingHeaders.delete(h));
        console.log(url.pathname);
        const targetUrl = info.base_url + url.pathname.replace(/^\/playground/, "") + url.search;
        console.log(targetUrl)
        try {
            const res = await fetch(targetUrl, {
                method: c.req.method,
                headers: incomingHeaders,
                body: ['GET', 'HEAD'].includes(c.req.method)
                    ? undefined
                    : c.req.raw.body,
            })
            await updateStatusCodeUsage({
                subscription_id: info.subscription_id,
                api_id: info.api_id,
                status_code: res.status
            });
            const responseHeaders = new Headers(res.headers);
            responseHeaders.delete("content-encoding");
            responseHeaders.delete("content-length");

            return new Response(res.body, {
                status: res.status,
                headers: responseHeaders,
            });
        }
        catch (err: any) {
            console.log(err)
            await updateStatusCodeUsage({
                subscription_id: info.subscription_id,
                api_id: info.api_id,
                status_code: 502
            });
            return c.json({
                message: "Upstream connection failed",
                error: err.code ?? "FETCH_ERROR",
                details: err.message,
            }, 502);
        }
    }
    catch (err) {

    }
}