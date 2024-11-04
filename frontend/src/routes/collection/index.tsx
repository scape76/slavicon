import { Button, buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
   ArrowRight,
   BookOpenText,
   Castle,
   ChevronLeft,
   ChevronRight,
   NotepadText,
} from "lucide-react";
import { FadeText } from "@/components/ui/fade-text";
import BlurFade from "@/components/ui/blur-fade";
import { describe } from "node:test";
import { Description } from "@radix-ui/react-dialog";
import { useState } from "react";

const collection = [
   {
      name: "Perun",
      function: "God of the Sky and Thunder",
      description: "Perun description",
      image: "/perun.png",
   },
   {
      name: "Veles",
      function: "God of the Earth and Underworld",
      description: "Veles description",
      image: "/velec.png",
   },
   {
      name: "Dazhbog",
      function: "God of the Underworld",
      description: "Dazhbog description",
      image: "/dazhbog-test.png",
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
      const [activeButton, setActiveButton] = useState("book");

      return (
         <section className="container h-[calc(100vh-var(--header-height))] flex gap-4 pb-0 pl-[1.5rem] pr-0">
            <div className="flex flex-col gap-4 w-5/12 pt-8 pr-9 pl-9 pb-7 rounded-md shadow-white-black gradient-border-mask mb-20">
               <div className="flex items-end justify-between ">
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.4, duration: 0.4 }}
                  >
                     <h1 className="text-5xl font-bold">{god.name}</h1>
                  </FadeText>
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.4, duration: 0.4 }}
                  >
                     <span className="text-2xl">{god.function}</span>
                  </FadeText>
               </div>
               <hr className="w-1/2 ml-auto border-b border-border" />
               <p className="text-2xl text-justify">{god.description}</p>
            </div>

            <div className="flex flex-col gap-2 w-16">
               <Button
                  variant={activeButton === "book" ? "active" : "outline"}
                  size="lg"
                  onClick={() => setActiveButton("book")}
               >
                  <BookOpenText />
               </Button>
               <Button
                  variant={activeButton === "notepad" ? "active" : "outline"}
                  size="lg"
                  onClick={() => setActiveButton("notepad")}
               >
                  <NotepadText />
               </Button>
               <Button
                  variant={activeButton === "castle" ? "active" : "outline"}
                  size="lg"
                  onClick={() => setActiveButton("castle")}
               >
                  <Castle />
               </Button>
            </div>

            <div className="relative flex-1 flex justify-center">
               <BlurFade
                  delay={0.3}
                  className="flex justify-center absolute -z-[1] bottom-0"
               >
                  <img
                     src={god.image}
                     alt={god.name}
                     className="w-full h-auto object-cover"
                  />
               </BlurFade>

               <div className="bg-[url('/background/question.png')] flex flex-col bg-no-repeat p-6 pt-9 w-[342px] items-center gap-4 h-[208px] absolute top-[-8px] left-2 bg-cover">
                  <FadeText
                     direction="left"
                     transition={{ delay: 0.4, duration: 0.4 }}
                  >
                     <h1 className="text-xl text-center">
                        I can tell you more in private chat
                     </h1>
                  </FadeText>
                  <Link
                     to="/c"
                     className="group text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground transition-colors duration-300 active:text-accent-foreground text-xl flex flex-col"
                  >
                     <FadeText
                        direction="left"
                        className="flex items-center"
                        transition={{ delay: 0.4, duration: 0.4 }}
                        framerProps={{}}
                     >
                        Ask a question
                        <ArrowRight className="size-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                     </FadeText>
                  </Link>
               </div>

               <div className="absolute left-[50%] translate-x-[-50%] bottom-[5rem] flex gap-2">
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
