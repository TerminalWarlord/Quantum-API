import { Hono } from "hono";
import { postUploadSignUrl } from "../controllers/storage_controllers/upload.controller";
import { userMiddleware } from "../middlewares/user_middleware";
import { postUpdateAvatar } from "../controllers/user_dashboard_controllers/edit_profile/edit_avatar.controller";



const uploadRouter = new Hono();


uploadRouter.post('/update-avatar', userMiddleware, postUpdateAvatar);
uploadRouter.post('/', userMiddleware, postUploadSignUrl);

export default uploadRouter;