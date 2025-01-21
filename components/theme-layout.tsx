"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { useEffect } from "react"

export function ThemeLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Add no-transitions class to prevent transitions on load
    document.documentElement.classList.add('no-transitions')
    
    // Remove the class after a short delay
    const timeout = setTimeout(() => {
      document.documentElement.classList.remove('no-transitions')
    }, 100)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-foreground">
                <span className="font-mono">job_vault</span>
              </h1>
              <nav className="ml-10 flex items-center space-x-4">
                <Link 
                  href="/" 
                  className="font-mono px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  /home
                </Link>
                <Link 
                  href="/jobs" 
                  className="font-mono px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  /jobs
                </Link>
                <Link 
                  href="/resume" 
                  className="font-mono px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  /resume
                </Link>
                <Link 
                  href="/account" 
                  className="font-mono px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  /account
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
} 