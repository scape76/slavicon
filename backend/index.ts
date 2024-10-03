import { init } from "@stricjs/app";

init({
  routes: ["./src"],
  serve: {
    port: process.env.PORT || 3001,
  },
});
