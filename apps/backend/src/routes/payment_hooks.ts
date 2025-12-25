import { Hono } from "hono";
import { subscriptionActivated, transactionCompleted } from "../controllers/payment_controllers/webhooks.controller";



const paymentHookRouter = new Hono();

paymentHookRouter.post('/transaction-completed', transactionCompleted);
paymentHookRouter.post('/subscription-activated', subscriptionActivated);
// TODO: add subscription renewal/pause/cancelled webhook
// paymentHookRouter.post('/subscription-updated', subscriptionUpdated);


export default paymentHookRouter;