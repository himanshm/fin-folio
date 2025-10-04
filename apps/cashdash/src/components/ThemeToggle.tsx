import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';

import { useTheme } from '@/contexts/AppContext';
import type { Theme } from '@/types';
import { DropdownMenuItem } from '@radix-ui/react-dropdown-menu';
import type { ElementType } from 'react';

const menuOptions: { label: string; value: Theme; icon: ElementType }[] = [
  {
    label: 'Light',
    value: 'light',
    icon: Sun
  },
  {
    label: 'Dark',
    value: 'dark',
    icon: Moon
  },
  {
    label: 'System',
    value: 'system',
    icon: Monitor
  }
];

const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 p-2">
        {menuOptions.map(option => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => setTheme(option.value)}
            className={cn(
              'flex items-center gap-5 px-2 py-1.5',
              theme === option.value && 'bg-accent'
            )}
          >
            <option.icon className="h-4 w-4" />
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ThemeToggle;
