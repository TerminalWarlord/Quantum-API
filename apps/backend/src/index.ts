import { Hono } from 'hono'
import authRouter from './routes/auth';
import contentRouter from './routes/content';
import { getApis } from './controllers/api_controllers/get_apis.controller';
import proxyRouter from './routes/proxy';
import paymentHookRouter from './routes/payment_hooks';
import { getEndpoints } from './controllers/api_controllers/get_endpoints.controller';
import { getParameters } from './controllers/api_controllers/get_parameters.controller';
import { cors } from 'hono/cors';

export const app = new Hono()

// TODO: update CORS
const allowedOrigins = [
  "http://localhost:3000"
];

app.use(cors({
  origin: allowedOrigins
}));

app.route('/auth', authRouter);
app.route('/manage', contentRouter);
app.route('/proxy/*', proxyRouter);
app.route('/paddle', paymentHookRouter);
app.get('/apis', getApis);
app.get("/get-endpoints", getEndpoints);
app.get("/get-parameters", getParameters);


app.get('/', async (c) => {
  return c.text('Hello Hono!')
})


export default {
  port: 3003,
  fetch: app.fetch,
} 
