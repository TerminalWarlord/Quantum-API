import { Hono } from "hono";
import { proxyController } from "../controllers/proxy.controller";



const proxyRouter = new Hono();


proxyRouter.all('/', proxyController);

export default proxyRouter;