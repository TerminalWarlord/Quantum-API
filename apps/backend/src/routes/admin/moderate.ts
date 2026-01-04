import { Hono } from "hono";
import { getAllUsers } from "../../controllers/admin_controllers/moderate_users/get_users.controller";
import { adminMiddleware } from "../../middlewares/admin_middleware";
import { deleteUser } from "../../controllers/admin_controllers/moderate_users/delete_user.controller";
import { getUserSubcriptions } from "../../controllers/admin_controllers/moderate_users/get_user_subscriptions.controller";
import { patchUpdateReview } from "../../controllers/admin_controllers/moderate_users/patch_update_review.controller";
import { patchUpdateApi } from "../../controllers/admin_controllers/moderate_users/patch_update_api.controller";

const adminModerateRouter = new Hono();


adminModerateRouter.get("/user/all", adminMiddleware, getAllUsers);
adminModerateRouter.delete("/user/remove/:user_id", adminMiddleware, deleteUser);
adminModerateRouter.get("/user/subscriptions", adminMiddleware, getUserSubcriptions);
adminModerateRouter.patch("/review/:review_id", adminMiddleware, patchUpdateReview);
adminModerateRouter.patch("/api/:api_id", adminMiddleware, patchUpdateApi);


export default adminModerateRouter;