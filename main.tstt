import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import moment from "moment";
import { globalErrorMiddleware } from "./src/middlewares/error.middleware.ts";
import { notFoundMiddleware } from "./src/middlewares/notfound.middleware.ts";
import { serve } from "@hono/node-server";
import { env } from "./src/env.ts";
import { createSessionController } from "./src/controllers/session.ts";
import * as whastapp from "wa-multi-session";
import { createMessageController } from "./src/controllers/message.ts";

const app = new Hono();

app.use(
  logger((...params) => {
    params.map((e) => console.log(`${moment().toISOString()} | ${e}`));
  })
);
app.use(cors());

app.onError(globalErrorMiddleware);
app.notFound(notFoundMiddleware);

/**
 * session routes
 */
app.route("/session", createSessionController());
/**
 * message routes
 */
app.route("/message", createMessageController());

const port = process.env.PORT || env.PORT;

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

whastapp.onConnected((session) => {
  console.log(`session: '${session}' connected`);
});

whastapp.loadSessionsFromStorage();
