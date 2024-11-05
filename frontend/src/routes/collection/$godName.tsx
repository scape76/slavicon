import { Button, buttonVariants } from "@/components/ui/button";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
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
import { useState } from "react";
import ky from "ky";
import { God, Result } from "@/types";

type GodPageInfo = God & {
  prevName: string;
  nextName: string;
};

export const Route = createFileRoute("/collection/$godName")({
  loader: async ({ params }) => {
    try {
      const response = await ky.get(`/api/gods/${params.godName}`);

      const { data } = (await response.json()) as Result<GodPageInfo>;

      return data;
    } catch (err) {
      throw notFound();
    }
  },
  notFoundComponent: () => (
    <section className="container h-[calc(100vh-var(--header-height))] flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col gap-4 w-1/2 pt-8 px-9 pb-7 rounded-md shadow-white-black gradient-border-mask text-center">
        <FadeText direction="down" transition={{ delay: 0.2, duration: 0.4 }}>
          <h1 className="text-5xl font-bold mb-4">Divine Mystery</h1>
        </FadeText>
        <FadeText direction="up" transition={{ delay: 0.4, duration: 0.4 }}>
          <p className="text-2xl">
            This deity seems to be hidden in the mists of time...
          </p>
        </FadeText>
      </div>

      <BlurFade delay={0.6} className="flex flex-col items-center gap-4">
        <Link
          to="/collection"
          className={buttonVariants({
            variant: "outline",
            className: "gap-2",
          })}
        >
          <ChevronLeft className="size-4" />
          Return to Collection
        </Link>
      </BlurFade>
    </section>
  ),
  component: () => {
    const god = Route.useLoaderData();

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
              <span className="text-2xl">{god.knownAs}</span>
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
            yOffset={0}
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
              preload={"render"}
              to={`/collection/${god.prevName}`}
              className={buttonVariants({
                variant: "ghost",
                size: "icon",
              })}
            >
              <ChevronLeft />
            </Link>
            <Link
              from={Route.id}
              preload={"render"}
              to={`/collection/${god.nextName}`}
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
