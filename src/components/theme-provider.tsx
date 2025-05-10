"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({
  children,
  defaultTheme = "system",
  enableSystem = true,
  ...props
}: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme={defaultTheme}
      enableSystem={enableSystem}
      {...props}
    >
      {children}
    </NextThemesProvider>
  );
}
