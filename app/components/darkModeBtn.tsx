"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

// forwardRef wrapper
const ThemeSwitcher = React.forwardRef<HTMLDivElement, React.ComponentPropsWithoutRef<"div">>(
  (props, ref) => {
    const { theme, setTheme } = useTheme();

    const toggleTheme = () => {
      setTheme(theme === "dark" ? "light" : "dark");
    };

    return (
      <DropdownMenuItem
        
        onClick={toggleTheme}
        className="flex items-center gap-3 px-3 py-3 rounded-xl bg-[#0E766E] hover:bg-white cursor-pointer text-black"
      >
        {theme === "dark" ? (
          <Sun className="w-5 h-5" />
        ) : (
          <Moon className="w-5 h-5" />
        )}
        <span className="flex-1 text-left">
          {theme === "dark" ? "Light Mode" : "Dark Mode"}
        </span>
      </DropdownMenuItem>
    );
  }
);

ThemeSwitcher.displayName = "ThemeSwitcher";

export default ThemeSwitcher;