import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ThemeLayout } from "@/components/theme-layout"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Job Vault",
  description: "Track your job applications",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange={false}
        >
          <ThemeLayout>{children}</ThemeLayout>
        </ThemeProvider>
      </body>
    </html>
  )
}

