import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Home | Your Portfolio',
  description: 'Welcome to my professional portfolio',
}

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Welcome</h1>
        <div className="prose dark:prose-invert max-w-none">
          {/* Add your content here */}
          <p className="text-xl">
            Hello! I'm [Your Name]. Welcome to my professional portfolio.
          </p>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">What I Do</h2>
            <p>
              Brief introduction about your expertise and what you're passionate about...
            </p>
          </div>
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold mb-4">Featured Projects</h2>
            {/* Add your featured projects or content here */}
          </div>
        </div>
      </div>
    </main>
  )
}

