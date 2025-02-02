import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import type { Resume, ResumeSection } from "@/types"

const SAMPLE_RESUME = {
  name: "Full Stack Developer Resume",
  description: "Resume focused on full-stack development experience",
  template: "modern",
  font_family: "inter",
  font_size: "base",
  line_spacing: "normal",
  margin_size: "md",
  ranking: 5,
  sections: [
    {
      type: "summary",
      title: "Professional Summary",
      content: "Experienced full-stack developer with a strong background in building scalable web applications using modern technologies. Proven track record of delivering high-quality solutions and leading development teams.",
      order_index: 0
    },
    {
      type: "experience",
      title: "Work Experience",
      content: `Senior Full Stack Developer | TechCorp Inc.
Jan 2020 - Present
• Led development of microservices architecture using Node.js and React
• Improved application performance by 40% through optimization
• Mentored junior developers and implemented code review processes

Full Stack Developer | WebSolutions Ltd
Jun 2017 - Dec 2019
• Developed and maintained multiple client projects using MERN stack
• Implemented CI/CD pipelines reducing deployment time by 60%
• Collaborated with UX team to improve user experience`,
      order_index: 1
    },
    {
      type: "skills",
      title: "Technical Skills",
      content: `Languages: JavaScript (ES6+), TypeScript, Python, SQL
Frontend: React, Next.js, Vue.js, HTML5, CSS3, Tailwind
Backend: Node.js, Express, Django, PostgreSQL, MongoDB
Tools: Git, Docker, AWS, CI/CD, Jest, Cypress`,
      order_index: 2
    },
    {
      type: "education",
      title: "Education",
      content: `Bachelor of Science in Computer Science
Tech University
2013 - 2017
• GPA: 3.8
• Relevant coursework: Data Structures, Algorithms, Web Development`,
      order_index: 3
    },
    {
      type: "projects",
      title: "Notable Projects",
      content: `E-commerce Platform Redesign
• Led team of 5 developers in complete platform overhaul
• Implemented headless CMS and modern frontend architecture
• Resulted in 25% increase in conversion rate

Real-time Analytics Dashboard
• Built scalable dashboard processing 1M+ events daily
• Utilized WebSocket for live updates and Redis for caching
• Reduced data processing latency by 70%`,
      order_index: 4
    },
    {
      type: "certifications",
      title: "Certifications",
      content: `AWS Certified Solutions Architect
Google Cloud Professional Developer
MongoDB Certified Developer`,
      order_index: 5
    }
  ]
}

export async function POST() {
  try {
    // Get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError) throw authError

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Create resume
    const { data: resume, error: resumeError } = await supabase
      .from('resumes')
      .insert([{
        ...SAMPLE_RESUME,
        user_id: user.id,
        history_id: user.id // Using user_id as history_id for now
      }])
      .select()
      .single()

    if (resumeError) throw resumeError

    // Create sections
    for (const section of SAMPLE_RESUME.sections) {
      const { error: sectionError } = await supabase
        .from('resume_sections')
        .insert([{
          ...section,
          resume_id: resume.id
        }])

      if (sectionError) throw sectionError
    }

    return NextResponse.json({ message: 'Sample resume created successfully', resume })
  } catch (error) {
    console.error('Error seeding resume:', error)
    return NextResponse.json(
      { error: 'Failed to seed resume' },
      { status: 500 }
    )
  }
} 