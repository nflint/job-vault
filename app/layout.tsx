import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import Link from "next/link"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Job Tracker",
  description: "Track your job applications efficiently",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-100">
          <header className="bg-white border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold">Job Tracker</h1>
                  <nav className="ml-10 flex items-center space-x-4">
                    <Link href="/" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Home
                    </Link>
                    <Link href="/jobs" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Jobs
                    </Link>
                    <Link href="/resume" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Resume
                    </Link>
                    <Link href="/account" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                      Account
                    </Link>
                  </nav>
                </div>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </body>
    </html>
  )
}

