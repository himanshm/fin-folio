import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown } from "lucide-react";
import { useMemo, useState } from "react";

type MonthOption = {
  label: string;
  value: string;
  date: Date;
};

const formatMonthLabel = (date: Date, locale: string) =>
  date.toLocaleDateString(locale, {
    month: "long",
    year: "numeric"
  });

const getMonthOptions = (locale: string, count = 12): MonthOption[] => {
  const options: MonthOption[] = [];
  const today = new Date();
  const startDate = new Date(today.getFullYear(), today.getMonth(), 1);

  for (let i = 0; i < count; i += 1) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() - i);

    options.push({
      date,
      value: date.toISOString(),
      label: formatMonthLabel(date, locale)
    });
  }

  return options;
};

const MonthDropdown = () => {
  const { user } = useAuth();
  const locale =
    user?.locale ||
    (typeof navigator !== "undefined" ? navigator.language : "en-US");

  const monthOptions = useMemo(() => getMonthOptions(locale), [locale]);
  const [selectedMonth, setSelectedMonth] = useState<MonthOption>(
    monthOptions[0]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="gap-2 rounded-full border-muted-foreground/40 px-5"
        >
          {selectedMonth.label}
          <ChevronDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="max-h-80 overflow-y-auto">
        {monthOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            className="justify-between"
            onClick={() => setSelectedMonth(option)}
          >
            {option.label}
            {selectedMonth.value === option.value && (
              <span className="text-xs text-primary">Current</span>
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default MonthDropdown;
