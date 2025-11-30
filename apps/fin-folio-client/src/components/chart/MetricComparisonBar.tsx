import { cn, getPercent } from "@/lib/utils";

type MetricComparisonBarProps = {
  leftLabel: string;
  rightLabel: string;
  leftValue: number;
  rightValue: number;
  /**
   * Optional max value for percentage calculations.
   * Defaults to leftValue if > 0, otherwise rightValue.
   */
  maxValue?: number;
  /**
   * Tailwind class for the left bar color.
   * Defaults to "bg-emerald-500".
   */
  leftColorClass?: string;
  /**
   * Tailwind class for the right bar color.
   * Defaults to "bg-rose-500".
   */
  rightColorClass?: string;
};

const MetricComparisonBar = ({
  leftLabel,
  rightLabel,
  leftValue,
  rightValue,
  maxValue,
  leftColorClass,
  rightColorClass
}: MetricComparisonBarProps) => {
  const denominator =
    maxValue && maxValue > 0
      ? maxValue
      : leftValue > 0
        ? leftValue
        : rightValue > 0
          ? rightValue
          : 1;

  const leftPercent = getPercent(leftValue, denominator);
  const rightPercent = getPercent(rightValue, denominator);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs font-medium uppercase tracking-wider text-muted-foreground">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex-1 rounded-full bg-muted/70 p-1">
          <div
            className={cn(
              "h-2 rounded-full",
              leftColorClass ?? "bg-emerald-500"
            )}
            style={{ width: `${leftPercent}%` }}
          />
        </div>
        <div className="flex-1 rounded-full bg-muted/70 p-1">
          <div
            className={cn("h-2 rounded-full", rightColorClass ?? "bg-rose-500")}
            style={{ width: `${rightPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default MetricComparisonBar;
