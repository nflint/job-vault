"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

/**
 *
 * @param root0
 * @param root0.children
 */
export function ThemeProvider({ 
  children, 
  ...props 
}: { 
  children: React.ReactNode
  [key: string]: any 
}) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
} 