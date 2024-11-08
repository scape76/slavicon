import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/example")({
  component: () => <Bubble />,
});

function Bubble() {
  return (
    <div className="relative max-w-[300px] p-4 bg-transparent border border-primary text-primary rounded-lg mb-12">
      {/* Main bubble content */}
      <div className="relative text-white z-10">Your message goes here</div>

      {/* Triangle pointer - using border-primary for the top border */}
      <div
        className="absolute -bottom-4 right-1
        border-l-[12px] border-l-transparent
        border-t-[16px] border-t-neutral-200
        border-r-[12px] border-r-transparent"
      ></div>
    </div>
  );
}
