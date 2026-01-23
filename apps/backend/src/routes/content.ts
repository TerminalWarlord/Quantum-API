import { Hono } from "hono";
import { postCreateApi } from "../controllers/api_controllers/create_api.controller";
import { postCreatePlan } from "../controllers/api_controllers/create_plan.controller";
import { userMiddleware } from "../middlewares/user_middleware";
import { postCreateCategory } from "../controllers/api_controllers/create_category.controller";
import { postCreateEndpoint } from "../controllers/api_controllers/create_endpoint.controller";
import { postCreateParameter } from "../controllers/api_controllers/create_parameter.controller";
import { postCreateApiKey } from "../controllers/api_controllers/create_api_key.controller";
import { postCreateReview } from "../controllers/api_controllers/create_review.controller";
import { getApiKeys } from "../controllers/api_controllers/get_api_key_id.controller";



const contentRouter = new Hono();

contentRouter.post('/create-api', userMiddleware, postCreateApi);
contentRouter.post('/create-api-plan', userMiddleware, postCreatePlan);
contentRouter.post('/create-category', userMiddleware, postCreateCategory);
contentRouter.post('/create-endpoint', userMiddleware, postCreateEndpoint);
contentRouter.post('/create-parameter', userMiddleware, postCreateParameter);
contentRouter.post('/create-api-key', userMiddleware, postCreateApiKey);
contentRouter.post('/create-review', userMiddleware, postCreateReview);
contentRouter.get('/keys', userMiddleware, getApiKeys);

export default contentRouter;