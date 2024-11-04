import ReactDOM from "react-dom/client";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";
import "./styles/globals.css";
import { RootNotFound } from "./not-found";

// Set up a Router instance
const router = createRouter({
   routeTree,
   defaultPreload: "intent",
   defaultNotFoundComponent: () => <RootNotFound />,
   notFoundMode: "fuzzy",
});

// Register things for tyspesafety
declare module "@tanstack/react-router" {
   interface Register {
      router: typeof router;
   }
}

const rootElement = document.getElementById("app")!;

if (!rootElement.innerHTML) {
   const root = ReactDOM.createRoot(rootElement);
   root.render(<RouterProvider router={router} />);
}
