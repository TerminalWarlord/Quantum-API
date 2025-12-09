import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { registerController } from "../controllers/authControllers/register.controller";
import { loginController } from "../controllers/authControllers/login.controller";



const authRouter = new Hono();

authRouter.post('/register', registerController);
authRouter.post('/login', loginController);

export default authRouter;