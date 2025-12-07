import { Hono } from 'hono'
import { prisma } from "@repo/db/client";

const app = new Hono()

app.get('/', async (c) => {
  return c.text('Hello Hono!')
})

export default app
