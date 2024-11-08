import { Button, ButtonProps, buttonVariants } from "@/components/ui/button";
import {
  Await,
  createFileRoute,
  defer,
  Link,
  notFound,
  useRouter,
} from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpenText,
  Castle,
  ChevronLeft,
  ChevronRight,
  Divide,
  NotepadText,
  Tablet,
} from "lucide-react";
import { FadeText } from "@/components/ui/fade-text";
import BlurFade from "@/components/ui/blur-fade";
import { useState } from "react";
import ky from "ky";
import { God, Result } from "@/types";
import { InfoTable } from "@/components/collection/info-table";
import { Markdown } from "@/components/markdown";
import { ScrollArea } from "@/components/ui/scroll-area";
import { serialize } from "next-mdx-remote/serialize";
import { useMediaQuery } from "usehooks-ts";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Switcher, Switchers } from "@/components/switchers";

type GodPageInfo = God & {
  prevName: string;
  nextName: string;
};

type Topic = "info" | "events" | "places";

function isTopic(t: unknown): t is Topic {
  return typeof t === "string" && ["info", "events", "places"].includes(t);
}

export const Route = createFileRoute("/collection/$godName")({
  loader: async ({ params }) => {
    try {
      const response = await ky.get(`/api/gods/${params.godName}`);

      const { data } = (await response.json()) as Result<GodPageInfo>;
      const serializeDetailsPromise = serialize(data.description || "");
      const serializePlacesPromise = serialize(data.places || "");

      return {
        ...data,
        detailsPromise: defer(serializeDetailsPromise),
        placesPromise: defer(serializePlacesPromise),
      };
    } catch (err) {
      throw notFound();
    }
  },
  validateSearch: (search: Record<string, unknown>): { topic: Topic } => {
    const topic = search?.topic;

    if (!isTopic(topic)) {
      return {
        topic: "info",
      };
    }

    return {
      topic: search.topic as Topic,
    };
  },
  notFoundComponent: NotFound,
  component: () => {
    const god = Route.useLoaderData();
    const { topic } = Route.useSearch();

    const router = useRouter();

    const isTablet = useMediaQuery("(max-width: 1024px)");

    return (
      <section className="container h-[calc(100vh-var(--header-height))] flex flex-col-reverse lg:flex-row gap-4 pb-8 pl-[1.5rem] lg:pr-0">
        <div className="flex flex-col flex-1 overflow-auto gap-4 lg:w-5/12 rounded-md shadow-white-black gradient-border-mask lg:mb-20">
          <div className="flex flex-col xl:flex-row xl:items-end justify-between ">
            <FadeText
              direction="left"
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <h1 className="text-3xl font-bold">{god.name}</h1>
            </FadeText>
            <FadeText
              direction="left"
              transition={{ delay: 0.4, duration: 0.4 }}
            >
              <span className="text-lg">{god.knownAs}</span>
            </FadeText>
          </div>
          <hr className="w-1/2 xl:ml-auto border-b border-border" />
          <ScrollArea className="pr-4">
            {topic === "info" && <InfoTable information={god.information} />}
            {topic === "events" && (
              <Await
                promise={god.detailsPromise}
                fallback={
                  <div className="grid gap-10">
                    <Skeleton className="w-3/4 h-10" />
                    <Skeleton className="w-full h-32" />
                  </div>
                }
              >
                {(source) => <Markdown mdxSource={source} />}
              </Await>
            )}
            {topic === "places" && (
              <Await
                promise={god.placesPromise}
                fallback={
                  <div className="grid gap-10">
                    <Skeleton className="w-3/4 h-10" />
                    <Skeleton className="w-full h-32" />
                  </div>
                }
              >
                {(source) => <Markdown mdxSource={source} />}
              </Await>
            )}
          </ScrollArea>
        </div>
        {!isTablet && <TopicSwitcher topic={topic} godName={god.name} />}
        {isTablet && (
          <div className="pt-[calc(18vh-110px)] sm:pt-[18vh] relative flex items-center justify-between">
            <TopicSwitcher topic={topic} godName={god.name} />
            <Switchers className="self-end">
              <Link
                from={Route.id}
                preload={"render"}
                search={{
                  topic,
                }}
                to={`/collection/${god.prevName}`}
              >
                <Switcher />
              </Link>
              <Switcher active />
              <Link
                from={Route.id}
                preload={"render"}
                search={{
                  topic,
                }}
                to={`/collection/${god.nextName}`}
              >
                <Switcher />
              </Link>
            </Switchers>
            <BlurFade
              delay={0.3}
              yOffset={0}
              className="absolute h-fit -z-[1] -top-[20vw] sm:-top-[30vw] right-[5%]"
            >
              <img
                src={god.image}
                alt={god.name}
                className="ml-auto w-[100%] object-cover translate-x-[28%]"
              />
            </BlurFade>
          </div>
        )}
        {!isTablet && (
          <div className="relative flex-1 justify-center">
            <BlurFade
              delay={0.3}
              yOffset={0}
              className="flex justify-center absolute -z-[1] bottom-0 h-full"
            >
              <img
                src={god.image}
                alt={god.name}
                className="w-full h-auto object-cover"
              />
            </BlurFade>

            <AskBubble className="absolute -top-[8px] left-2" />

            <div className="absolute left-[50%] translate-x-[-50%] bottom-[5rem] flex gap-2">
              <Link
                from={Route.id}
                preload={"render"}
                search={{
                  topic,
                }}
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
                search={{
                  topic,
                }}
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
        )}
      </section>
    );
  },
});

function AskBubble({ className }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "bg-[url('/background/question.png')] flex flex-col bg-no-repeat p-6 lg:pt-9 w-[300px] h-[160px]  lg:w-[342px] items-center gap-4 lg:h-[208px]  bg-contain",
        className
      )}
    >
      <FadeText direction="left" transition={{ delay: 0.4, duration: 0.4 }}>
        <h1 className="lg:text-xl lg:text-center">
          I can tell you more in private chat
        </h1>
      </FadeText>
      <Link
        to="/c"
        className="group text-muted-foreground hover:text-accent-foreground focus:text-accent-foreground transition-colors duration-300 active:text-accent-foreground lg:text-xl flex flex-col"
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
  );
}

function NotFound() {
  return (
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
  );
}

function TopicSwitcher({ topic, godName }: { topic: Topic; godName: string }) {
  const router = useRouter();
  const isTablet = useMediaQuery("(max-width: 1024px)");

  const btnSize = isTablet ? "icon-md" : "lg";

  return (
    <div className="flex flex-col sm:flex-row lg:flex-col gap-2 ">
      <Button
        variant={topic === "info" ? "active" : "outline"}
        size={btnSize}
        onClick={() =>
          router.navigate({
            to: `/collection/${godName}`,
            search: {
              topic: "info",
            },
          })
        }
      >
        <BookOpenText />
      </Button>
      <Button
        variant={topic === "events" ? "active" : "outline"}
        size={btnSize}
        onClick={() =>
          router.navigate({
            to: `/collection/${godName}`,
            search: {
              topic: "events",
            },
          })
        }
      >
        <NotepadText />
      </Button>
      <Button
        variant={topic === "places" ? "active" : "outline"}
        size={btnSize}
        onClick={() =>
          router.navigate({
            to: `/collection/${godName}`,
            search: {
              topic: "places",
            },
          })
        }
      >
        <Castle />
      </Button>
    </div>
  );
}
