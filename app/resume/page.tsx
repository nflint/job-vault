import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Resume | Your Portfolio',
  description: 'Professional resume and experience',
}

export default function ResumePage() {
  return (
    <main className="flex min-h-screen flex-col items-center p-8">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold mb-6">Resume</h1>
        
        <div className="prose dark:prose-invert max-w-none">
          {/* Experience Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Professional Experience</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium">Company Name</h3>
                <p className="text-gray-600 dark:text-gray-400">Position • Date Range</p>
                <ul className="list-disc ml-6 mt-2">
                  <li>Key achievement or responsibility</li>
                  <li>Another key achievement</li>
                </ul>
              </div>
              {/* Add more experience entries as needed */}
            </div>
          </section>

          {/* Education Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Education</h2>
            <div>
              <h3 className="text-xl font-medium">University Name</h3>
              <p className="text-gray-600 dark:text-gray-400">Degree • Graduation Year</p>
              <p>Relevant coursework or achievements</p>
            </div>
          </section>

          {/* Skills Section */}
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Skills</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Programming Languages</h3>
                <ul className="list-disc ml-6">
                  <li>JavaScript/TypeScript</li>
                  <li>Python</li>
                  {/* Add more skills */}
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-medium mb-2">Frameworks</h3>
                <ul className="list-disc ml-6">
                  <li>React</li>
                  <li>Next.js</li>
                  {/* Add more frameworks */}
                </ul>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
} 