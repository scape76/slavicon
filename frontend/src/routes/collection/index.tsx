import { Button, buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BookOpenText,
  Castle,
  ChevronLeft,
  ChevronRight,
  NotepadText,
} from "lucide-react";
import { FadeText } from "@/components/ui/fade-text";
import BlurFade from "@/components/ui/blur-fade";

const collection = [
  {
    name: "Perun",
    description: "God of the Sky and Thunder",
    image: "/perun.jpg",
  },
  {
    name: "Veles",
    description: "God of the Earth and Underworld",
    image: "/velec.png",
  },
  {
    name: "Dazhbog",
    description: "God of the Underworld",
    image: "/dazhbog.jpg",
  },
] as const;

type GodSearch = {
  name: (typeof collection)[number]["name"];
};

export const Route = createFileRoute("/collection/")({
  validateSearch: (search: Record<string, unknown>): GodSearch => {
    if (!("name" in search) || !search.name) {
      return {
        name: collection[0].name,
      };
    }

    if (!hasSome(search.name)) {
      return {
        name: collection[0].name,
      };
    }

    return search as GodSearch;
  },
  component: () => {
    const { name } = Route.useSearch();

    const god = getGod(name);

    return (
      <section className="container h-[calc(100vh-var(--header-height))] flex gap-4 md:pb-10">
        <div className="flex flex-col gap-4 flex-1 shadow-md border p-4 rounded-md">
          <div className="flex items-center justify-between">
            <FadeText
              direction="left"
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h1 className="text-2xl font-bold">{god.name}</h1>
            </FadeText>
            <FadeText
              direction="left"
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <span>{god.description}</span>
            </FadeText>
          </div>
          <hr className="w-1/2 ml-auto border-b border-border" />
          <p>
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sit, nam
            voluptates quae necessitatibus quod sapiente aspernatur accusantium
            numquam ut quisquam?
          </p>
        </div>
        <div className="flex flex-col gap-2 w-16">
          <Button variant="outline" size="icon">
            <BookOpenText />
          </Button>
          <Button variant="outline" size="icon">
            <NotepadText />
          </Button>
          <Button variant="outline" size="icon">
            <Castle />
          </Button>
        </div>
        <div className="relative flex-1">
          <BlurFade delay={0.2}>
            <img src={god.image} alt={god.name} className="dark:invert max-h-full z-10" />
          </BlurFade>
          <div className="absolute left-[50%] translate-x-[-50%] bottom-0 flex gap-2">
            <Link
              from={Route.id}
              preload={"intent"}
              search={{ name: getPrev(god.name) }}
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <ChevronLeft />
            </Link>
            <Link
              from={Route.id}
              preload={"intent"}
              search={{ name: getNext(god.name) }}
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <ChevronRight />
            </Link>
          </div>
        </div>
      </section>
    );
  },
});

function getPrev(_name: string) {
  const index = collection.findIndex(({ name }) => name === _name);
  if (index === 0) return collection[collection.length - 1].name;
  return collection[index - 1].name;
}

function getNext(_name: string) {
  const index = collection.findIndex(({ name }) => name === _name);
  if (index === collection.length - 1) return collection[0].name;
  return collection[index + 1].name;
}

function getGod(_name: string) {
  return collection.find(({ name }) => name === _name) || collection[0];
}

function hasSome(_name?: any): _name is (typeof collection)[number]["name"] {
  return collection.some(({ name }) => name === _name);
}
