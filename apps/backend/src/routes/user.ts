import { Hono } from "hono";
import { userMiddleware } from "../middlewares/user_middleware";
import { getUser } from "../controllers/user_dashboard_controllers/edit_profile/user.controller";
import { getSearchUsername } from "../controllers/user_dashboard_controllers/edit_profile/search_username.controller";
import { postUpdateUser } from "../controllers/user_dashboard_controllers/edit_profile/update_profile.controller";



const userRouter = new Hono();

userRouter.get('/', userMiddleware, getSearchUsername);
userRouter.get('/get-me', userMiddleware, getUser);
userRouter.post('/update', userMiddleware, postUpdateUser);


export default userRouter;