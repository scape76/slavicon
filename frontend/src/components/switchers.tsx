import { cn } from "@/lib/utils";
import { ButtonProps } from "./ui/button";

export function Switchers({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function Switcher({
  className,
  active = false,
  ...props
}: ButtonProps & { active?: boolean }) {
  return (
    <button
      className={cn(
        "py-4 relative group",
        className,
        "after:absolute after:bottom-0 after:left-0 after:w-full after:h-1 after:bg-neutral-300 after:opacity-0 hover:after:opacity-30 after:transition-opacity"
      )}
      {...props}
    >
      <div
        className={cn(`w-16 h-1 rounded-md bg-neutral-300 transition-opacity`, {
          "opacity-100": active,
          "opacity-55": !active,
        })}
      />
    </button>
  );
}
