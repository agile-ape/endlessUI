'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import dynamic from 'next/dynamic';

function DarkModeSwitcher() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
    >
      {theme === 'dark' ? (
        <>
          <Moon className="w-4 h-4" />
          <span className="sr-only">Toggle theme</span>
        </>
      ) : (
        <>
          <Sun className="w-4 h-4" />
          <span className="sr-only">Toggle theme</span>
        </>
      )}
    </Button>
  );
}

export default dynamic(() => Promise.resolve(DarkModeSwitcher), {
  ssr: false,
});
