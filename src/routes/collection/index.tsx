import { createFileRoute } from "@tanstack/react-router";

type God = {
  name: string;
  description: string;
};

// will be fetched from the database eventually
const collection: God[] = [
  {
    name: "Perun",
    description: "God of the Sky and Thunder",
  },
  {
    name: "Veles",
    description: "God of the Earth and Underworld",
  },
  {
    name: "Dazhbog",
    description: "God of the Underworld",
  },
];

export const Route = createFileRoute("/collection/")({
  component: () => (
    <div>
      Hello /collection/!
      <div className="flex flex-col gap-2">
        {collection.map((god) => (
          <div key={god.name}>
            <h3>{god.name}</h3>
            <p>{god.description}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
