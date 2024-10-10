import { createFileRoute, Link } from "@tanstack/react-router";

const collection = [
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
  component: () => {
    return (
      <section className="container">
        <div className="flex justify-between gap-2">
          {collection.map((god) => (
            <Link to="/c" key={god.name} className="border rounded-md p-4">
              <h3>{god.name}</h3>
              <p>{god.description}</p>
            </Link>
          ))}
        </div>
      </section>
    );
  },
});
