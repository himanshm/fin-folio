import type { ChartConfig } from "../ui/chart";

export const createTooltipFormatter = (
  config: ChartConfig,
  valueFormatter: (value: number) => string
) => {
  return (value: number, name: string) => {
    const label = config[name as keyof typeof config]?.label ?? name;

    return (
      <div className="flex items-center justify-between gap-6">
        <span className="capitalize text-muted-foreground">{label}</span>
        <span className="font-mono font-medium text-foreground">
          {valueFormatter(value)}
        </span>
      </div>
    );
  };
};
