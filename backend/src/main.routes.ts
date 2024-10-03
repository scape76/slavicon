import { routes } from "@stricjs/app";
import { text, json } from "@stricjs/app/send";
import { CORS } from "@stricjs/utils";

const cors = new CORS({
  allowMethods: ["GET", "POST", "PUT", "DELETE"],
  allowCredentials: true,
  allowOrigins: ["http://localhost:3000"],
  appendHeaders: true,
});

const PORT = process.env.PORT || 3001;

export default routes()
  .use(cors)
  .get("/chats", () => {
    const chats = [
      {
        id: "1",
        name: "Chat 1",
      },
      {
        id: "2",
        name: "Chat 2",
      },
    ];

    return json(chats);
  })
  .get("/chats/:id", (ctx) => {
    if (Number(ctx.params.id) > 2) {
      return new Response(null, { status: 404 });
    }

    return json({
      name: `Chat ${ctx.params.id}`,
      id: ctx.params.id,
    });
  });
