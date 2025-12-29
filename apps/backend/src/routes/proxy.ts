import { Hono } from "hono";
import { proxyController } from "../controllers/proxy_controllers/proxy.controller";



const proxyRouter = new Hono();


proxyRouter.all('/', proxyController);

export default proxyRouter;