import { Metadata } from 'next'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartLine, BrainCircuit, BarChart3, Rocket } from "lucide-react"
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Job Vault | Smart Job Application Tracking',
  description: 'Track and optimize your job search with AI-powered insights and analytics',
}

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-purple-500/10 via-pink-500/5 to-background">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-400 bg-clip-text text-transparent">
              Your Job Search, Elevated
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Track applications, get AI-powered insights, and land your dream job faster with Job Vault.
            </p>
            <Link href="/jobs">
              <Button size="lg" className="mr-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="border-pink-500/20 hover:bg-pink-500/10">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="bg-card/50 backdrop-blur border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardHeader>
                <ChartLine className="w-10 h-10 text-purple-500 mb-4" />
                <CardTitle>Smart Job Tracking</CardTitle>
                <CardDescription>
                  Organize applications, deadlines, and follow-ups in one place
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <CardHeader>
                <BrainCircuit className="w-10 h-10 text-pink-500 mb-4" />
                <CardTitle>AI Optimization</CardTitle>
                <CardDescription>
                  Get personalized suggestions to improve your application success rate
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-purple-500/20 hover:border-purple-500/40 transition-colors">
              <CardHeader>
                <BarChart3 className="w-10 h-10 text-purple-500 mb-4" />
                <CardTitle>Analytics Dashboard</CardTitle>
                <CardDescription>
                  Track your progress with detailed insights and visualizations
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-card/50 backdrop-blur border-pink-500/20 hover:border-pink-500/40 transition-colors">
              <CardHeader>
                <Rocket className="w-10 h-10 text-pink-500 mb-4" />
                <CardTitle>Career Growth</CardTitle>
                <CardDescription>
                  Stay organized and focused on your professional development
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-500/5 via-pink-500/5 to-purple-500/5">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">Ready to Transform Your Job Search?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of job seekers who have streamlined their application process with Job Vault.
          </p>
          <Link href="/jobs">
            <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0">
              Start Tracking Now
            </Button>
          </Link>
        </div>
      </section>
    </main>
  )
}

