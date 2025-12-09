import { Hono } from 'hono'
import authRouter from './routes/auth';
import contentRouter from './routes/content';
import { getApis } from './controllers/apiControllers/getApiscontroller';

const app = new Hono()


app.route('/auth', authRouter);
app.route('/manage', contentRouter);
app.get('/apis', getApis);

app.get('/', async (c) => {
  return c.text('Hello Hono!')
})


export default {
  port: 3003,
  fetch: app.fetch,
} 
