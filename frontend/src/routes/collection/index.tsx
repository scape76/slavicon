import { createFileRoute } from "@tanstack/react-router";
import { log } from "console";

export const Route = createFileRoute("/collection/")({
   component: CollectionComponent,
});

function CollectionComponent() {
   return <p>hello</p>;
}
