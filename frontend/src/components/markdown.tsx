import { cn } from "@/lib/utils";
import { MDXRemote, MDXRemoteSerializeResult } from "next-mdx-remote";

type SerializeResult = MDXRemoteSerializeResult<
  Record<string, unknown>,
  Record<string, unknown>
>;

interface MarkdownProps {
  mdxSource: SerializeResult;
}

const components = {
  Place,
};

export function Markdown({ mdxSource }: MarkdownProps) {
  return (
    <article className="prose dark:prose-invert prose-neutral max-w-none">
      <MDXRemote components={components} {...mdxSource} />
    </article>
  );
}

type PlaceProps = {
  image: string;
  imageAlt?: string;
  float?: "left" | "right";
  children: string;
};

function Place({ image, children, imageAlt, float = "left" }: PlaceProps) {
  return (
    <div className="[&>p]:my-0 mb-4 overflow-auto">
      <img
        src={image}
        alt={imageAlt ?? ""}
        className={cn("w-1/2 my-0 rounded-md", {
          "float-right ml-2": float === "right",
          "float-left mr-2": float === "left",
        })}
      />
      {children}
    </div>
  );
}
