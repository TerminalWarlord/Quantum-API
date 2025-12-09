import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { registerController } from "../controllers/authControllers/register.controller";
import { postCreateApi } from "../controllers/apiControllers/createApi.controller";
import { postCreatePlan } from "../controllers/apiControllers/createPlan.controller";
import { middleware } from "../middlewares/middleware";



const contentRouter = new Hono();

contentRouter.post('/create-api', middleware, postCreateApi);
contentRouter.post('/create-api-plan', middleware, postCreatePlan);
// contentRouter.post('/create-api-plan', middleware, postCreatePlan);


export default contentRouter;