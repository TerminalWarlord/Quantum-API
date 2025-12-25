import { Hono } from "hono";
import { registerController } from "../controllers/auth_controllers/register.controller";
import { loginController } from "../controllers/auth_controllers/login.controller";



const authRouter = new Hono();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);

export default authRouter;