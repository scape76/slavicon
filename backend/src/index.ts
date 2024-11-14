import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { chatsRouter } from "./routes/chats";
import { godsRouter } from "./routes/gods";
import { auth } from "./auth";

const app = new Hono();

app.use(
  "*",
  cors({
    origin: ["http://localhost:3000", "https://slavicon.vercel.app"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use("*", csrf());

// app.route("/auth", authRouter);
app.get("/api/auth/*", (c) => auth.handler(c.req.raw));
app.post("/api/auth/*", (c) => auth.handler(c.req.raw));
app.route("/chats", chatsRouter);
app.route("/gods", godsRouter);

export default app;
