import { Hono } from "hono";
import { logger } from "hono/logger";
import { cors } from "hono/cors";
import moment from "moment";
import { globalErrorMiddleware } from "./middlewares/error.middleware.ts";
import { notFoundMiddleware } from "./middlewares/notfound.middleware.ts";
import { serve } from "@hono/node-server";
import { env } from "./env.ts";
import { createSessionController } from "./controllers/session.ts";
import * as whatsapp from "wa-multi-session";
import { createMessageController } from "./controllers/message.ts";

const app = new Hono();

// Logging Middleware
app.use("*", logger((message) => console.log(`${moment().toISOString()} | ${message}`)));

// Enable CORS
app.use("*", cors());

// Global Error Handling
app.onError(globalErrorMiddleware);

// 404 Not Found Middleware
app.notFound(notFoundMiddleware);

/**
 * Session Routes
 */
app.route("/session", createSessionController());

/**
 * Message Routes
 */
app.route("/message", createMessageController());

// Start the server
const port = env.PORT || 3000; // Fallback ke port 3000 jika `env.PORT` tidak tersedia
serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

// WhatsApp Event Handlers
whatsapp.onConnected((session) => {
  console.log(`Session '${session}' connected`);
});

// Load WhatsApp Sessions
(async () => {
  try {
    await whatsapp.loadSessionsFromStorage();
    console.log("All sessions loaded successfully");
  } catch (error) {
    console.error("Failed to load sessions:", error);
  }
})();
