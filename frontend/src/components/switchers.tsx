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
        "after:absolute after:bottom-2 after:left-[50%] after:-translate-x-[50%] after:w-[80%] after:h-1 after:rounded-sm after:bg-neutral-300 after:opacity-0 hover:after:opacity-30 after:transition-opacity"
      )}
      {...props}
    >
      <div
        className={cn(` h-1 rounded-md bg-neutral-300 transition-opacity`, {
          "opacity-100 w-16": active,
          "opacity-55 w-14": !active,
        })}
      />
    </button>
  );
}
