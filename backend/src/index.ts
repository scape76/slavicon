import { Hono } from "hono";
import { cors } from "hono/cors";
import { csrf } from "hono/csrf";
import { authRouter } from "./routes/auth";
import { chatsRouter } from "./routes/chats";
import { godsRouter } from "./routes/gods";

const app = new Hono();

const origins = ["http://localhost:3000", "https://slavicon.vercel.app"];

app.use(
  "*",
  cors({
    origin: origins,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(
  "*",
  csrf({
    origin: origins,
  })
);

app.route("/auth", authRouter);
app.route("/chats", chatsRouter);
app.route("/gods", godsRouter);

export default app;
