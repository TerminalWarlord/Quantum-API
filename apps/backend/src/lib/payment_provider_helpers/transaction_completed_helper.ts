import { db, invoiceTable, planTable, subscriptionTable, transactionTable } from "@repo/db/client";
import { InternalServerError, NotFoundError, SubscriptionDataType, SubscriptionStatusEnums, TransactionType, UnauthorizedError } from "@repo/types";
import { eq } from "drizzle-orm";
import { getSubscriptionDetails } from "./get_subscription_details";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "";

export const transactionCompletedHelper = async (tx: TransactionType) => {
    const subscriptionId = tx.subscription_id;

    // Find subscription
    let [sub] = await db
        .select({
            id: subscriptionTable.id,
            user_id: subscriptionTable.user_id
        })
        .from(subscriptionTable)
        .where(eq(subscriptionTable.provider_subscription_id, subscriptionId))
        .limit(1);
    console.log(sub);



    if (!sub) {
        // Subscription doesnt exist in DB
        // fetch subscription details

        const subsciptionData: SubscriptionDataType = await getSubscriptionDetails(subscriptionId);
        console.log(subsciptionData);

        if (subsciptionData.status !== SubscriptionStatusEnums.active) {
            throw new Error("Subscription is not active!");
        }
        if (!subsciptionData.custom_data.user_id) {
            throw new UnauthorizedError("Unauthorized!");
        }
        try {
            const user = jwt.verify(subsciptionData.custom_data.user_id, JWT_SECRET) as { id: number };
            if (!user || !user.id) {
                throw new UnauthorizedError("Unauthorized!");
            }
            const priceId = subsciptionData.items[0].price.id;
            const [plan] = await db
                .select({ id: planTable.id, api_id: planTable.api_id })
                .from(planTable)
                .where(eq(planTable.price_id, priceId));
            if (!plan) {
                throw new NotFoundError("Plan is not found!");
            }
            [sub] = await db.insert(subscriptionTable).values({
                current_period_end: new Date(subsciptionData.current_billing_period.ends_at),
                current_period_start: new Date(subsciptionData.current_billing_period.starts_at),
                user_id: user.id,
                provider_subscription_id: subscriptionId,
                api_id: plan.api_id,
                plan_id: plan.id
            }).returning({
                id: subscriptionTable.id,
                user_id: subscriptionTable.user_id
            });
            if (!sub) {
                throw new InternalServerError("Failed to create subscription");
            }
        }
        catch (err) {
            throw new UnauthorizedError("Unauthorized!");
        }
        throw new NotFoundError("Subscription ID doesnt exist in DB");
    }


    const providerInvoiceId = tx.invoice_id;
    const [invoice] = await db
        .select()
        .from(invoiceTable)
        .where(eq(invoiceTable.provider_invoice_id, providerInvoiceId))
        .limit(1);

    let invoiceId: number;
    if (!invoice) {
        try {
            const [newInvoice] = await db.insert(invoiceTable).values({
                provider: "paddle",
                amount_in_cents: Number(tx.details.totals.total),
                period_start: new Date(tx.billing_period.starts_at),
                period_end: new Date(tx.billing_period.ends_at),
                provider_invoice_id: tx.invoice_id,
                subscription_id: sub.id,
                user_id: sub.user_id,
                status: "paid",
                created_at: new Date(tx.created_at),
                currency: tx.currency_code
            }).returning({ id: invoiceTable.id });
            if (!newInvoice) throw new Error("Failed to create new invoice!");
            invoiceId = newInvoice.id;
        }
        catch (err) {
            console.log(err);
            throw new InternalServerError("Failed to create invoice!");
        }
    }
    else invoiceId = invoice.id;

    const transactionId = tx.id;
    const [transaction] = await db
        .select()
        .from(transactionTable)
        .where(eq(transactionTable.provider_transaction_id, transactionId))
        .limit(1);

    if (!transaction) {
        const [newTx] = await db.insert(transactionTable).values({
            amount_in_cents: Number(tx.details.totals.total),
            provider_transaction_id: tx.id,
            created_at: new Date(tx.created_at),
            currency: tx.currency_code,
            status: tx.status,
            provider: "paddle",
            invoice_id: invoiceId
        }).returning({ id: transactionTable.id });
        if (!newTx) {
            throw new InternalServerError("Failed to create new Transaction");
        }
        return {
            message: "Successful",
            transaction_id: newTx.id,
            invoice_id: invoiceId
        }
    }

}