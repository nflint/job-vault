# Job Vault

A modern web application for managing job applications, professional history, and resume generation.

## Features

### Resume Management
- Create and edit professional resumes with customizable sections
- Real-time preview of resume changes
- Export resumes to PDF
- Customizable styling:
  - Font families (Inter, Roboto, Open Sans, Lato, Montserrat)
  - Font sizes (10px - 18px)
  - Line spacing (1.25 - 1.75)
  - Margin sizes (1rem - 3rem)
- Drag-and-drop section reordering

### Professional History
- Track work experience, education, projects, and skills
- Import data from LinkedIn
- Automatic skill extraction
- Achievement tracking with impact metrics

### Job Applications
- Save and track job applications
- Rate and bookmark positions
- Track application status and deadlines
- Follow-up reminders

## Tech Stack
- Next.js for the frontend and API routes
- Supabase for authentication and database
- Tailwind CSS for styling
- Puppeteer for PDF generation
- TypeScript for type safety

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
   1. Copy the `.env.example` file to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   
   2. Fill in the required environment variables in `.env.local`:
   ```bash
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_project_url           # URL from Supabase project settings
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key        # Public anon key from Supabase project settings
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key    # Service role key (keep this secret!)
   
   # PDF Export Configuration
   PDF_EXPORT_SECRET=your_secret_key                  # Secret key for securing PDF exports
   PDF_STORAGE_PATH=/path/to/storage                  # Local path for temporary PDF storage
   
   # Optional: Development Settings
   NEXT_PUBLIC_DEV_MODE=false                        # Enable additional logging and dev features
   ```

   3. Obtain Supabase credentials:
      - Create a project at [supabase.com](https://supabase.com)
      - Go to Project Settings > API
      - Copy the Project URL and anon/public key
      - For the service role key (if needed), use the service_role key (keep this secret!)

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Database Setup

The application requires a Supabase database with the following tables:
- resumes
- resume_sections
- resume_exports
- professional_histories
- work_experiences
- education
- projects
- skills
- certifications

Refer to the schema documentation in `docs/resume-management-requirements.md` for detailed table structures.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 