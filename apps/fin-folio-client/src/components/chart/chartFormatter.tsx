import type { ChartConfig } from "@/components/ui/chart";

type RechartsValue = string | number | (string | number)[];
type RechartsName = string | number;

export const createTooltipFormatter = (
  config: ChartConfig,
  valueFormatter: (value: number) => string,
  labelResolver?: (name: string) => string
) => {
  return (rawValue: RechartsValue, name: RechartsName) => {
    const key = String(name);
    const label =
      labelResolver?.(key) ?? config[key as keyof typeof config]?.label ?? key;

    const numericValue = Number(rawValue);
    return (
      <div className="flex items-center justify-between gap-6">
        <span className="capitalize text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">
          {valueFormatter(numericValue)}
        </span>
      </div>
    );
  };
};
