import { Context } from "hono";
import { transactionCompletedHelper } from "../../lib/payment_provider_helpers/transaction_completed_helper";
import { subscriptionActivatedHelper } from "../../lib/payment_provider_helpers/subscription_activated_helper";
import { AppError } from "@repo/types";


// transaction.completed
export const transactionCompleted = async (c: Context) => {
    const tx = (await c.req.json()).data;
    try {
        return c.json(await transactionCompletedHelper(tx));
    }
    catch (err) {
        if (err instanceof AppError) {
            return c.json({
                message: err.message,
                code: err.code
            }, err.statusCode);
        }
        console.log(err)
        return c.json({
            message: "Internal server error"
        }, 500);
    }

}



// on webhook event -> subscription.activated (Scenario: new user)
export const subscriptionActivated = async (c: Context) => {
    const body = await c.req.json();
    const subscriptionData = body.data;

    try {
        return c.json(await subscriptionActivatedHelper(subscriptionData));
    }
    catch (err) {
        if (err instanceof AppError) {
            return c.json({
                message: err.message,
                code: err.code
            }, err.statusCode);
        }
        return c.json({
            message: "Internal server error"
        }, 500)
    }
}


// TODO: subscription.updated (Scenario: renew/pause/resume)

// TODO: past_due

// TODO: paused

// TODO: resumed