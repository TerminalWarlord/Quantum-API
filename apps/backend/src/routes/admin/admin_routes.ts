import { Hono } from "hono";
import adminOverviewRouter from "./overview";
import adminModerateRouter from "./moderate";

const adminRouter = new Hono();


adminRouter.route("/overview", adminOverviewRouter);
adminRouter.route("/moderate", adminModerateRouter);


export default adminRouter;