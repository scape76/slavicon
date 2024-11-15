import { GodsCarousel } from "@/components/collection/carousel";
import { api } from "@/lib/api";
import { God, Result } from "@/types";
import { createFileRoute } from "@tanstack/react-router";

export type GodBasic = Pick<God, "name" | "image" | "knownAs">;

export const Route = createFileRoute("/collection/")({
  loader: async () => {
    const res = (await api.get("gods/collection").json()) as Result<GodBasic[]>;

    return res.data;
  },
  component: CollectionComponent,
});

function CollectionComponent() {
  const collection = Route.useLoaderData();

  return (
    <GodsCarousel
      collection={collection.map((g) => ({
        ...g,
        knownAs: minifiedKnownAs(g.knownAs),
      }))}
      options={{ loop: true }}
    />
  );
}

const minifiedKnownAs = (ka: string) => ka.split("and")[0];
