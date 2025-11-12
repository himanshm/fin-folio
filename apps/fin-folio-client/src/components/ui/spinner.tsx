import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import type { SVGProps } from "react";

interface SpinnerProps extends SVGProps<SVGSVGElement> {
  LoaderIcon: LucideIcon;
}

function Spinner({ LoaderIcon, className, ...props }: SpinnerProps) {
  return (
    <LoaderIcon
      role="status"
      aria-label="Loading"
      className={cn("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
