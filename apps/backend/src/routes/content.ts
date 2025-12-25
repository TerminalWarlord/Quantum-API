import { Hono } from "hono";
import { postCreateApi } from "../controllers/api_controllers/create_api.controller";
import { postCreatePlan } from "../controllers/api_controllers/create_plan.controller";
import { middleware } from "../middlewares/middleware";
import { postCreateCategory } from "../controllers/api_controllers/create_category.controller";



const contentRouter = new Hono();

contentRouter.post('/create-api', middleware, postCreateApi);
contentRouter.post('/create-api-plan', middleware, postCreatePlan);
contentRouter.post('/create-category', middleware, postCreateCategory);


export default contentRouter;