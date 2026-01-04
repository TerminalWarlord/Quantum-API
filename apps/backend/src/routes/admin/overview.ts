import { Hono } from "hono";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { getOverview } from "../../controllers/admin_controllers/dashboard/get_overview.controller";
import { getOverviewRevenue } from "../../controllers/admin_controllers/dashboard/get_revenue.controller";
import { getOverviewUsage } from "../../controllers/admin_controllers/dashboard/get_usage.controller";
import { getOverviewAllRequests, getOverviewFailedRequests } from "../../controllers/admin_controllers/dashboard/get_failed_requests.controller";


const adminOverviewRouter = new Hono();

adminOverviewRouter.get("/revenue", adminMiddleware, getOverviewRevenue);
adminOverviewRouter.get("/usage", adminMiddleware, getOverviewUsage);
adminOverviewRouter.get("/failed-requests", adminMiddleware, getOverviewFailedRequests);
adminOverviewRouter.get("/requests", adminMiddleware, getOverviewAllRequests);
adminOverviewRouter.get("/", adminMiddleware, getOverview);




export default adminOverviewRouter;