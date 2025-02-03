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

## Documentation Standards

This project follows strict documentation standards to maintain code quality and developer experience.

### Documentation Requirements

- All files must include a file-level JSDoc comment explaining its purpose
- All exported functions, classes, and interfaces must be documented
- All parameters and return values must be typed and described
- Complex logic sections should include explanatory comments

### Example Documentation

```typescript
/**
 * @fileoverview Brief description of the file's purpose
 * Additional context about the module if needed
 */

/**
 * Description of what the function does
 * 
 * @param {string} param1 - Description of param1
 * @returns {boolean} Description of return value
 * 
 * @example
 * const result = myFunction('test');
 * // Returns: true
 */
function myFunction(param1: string): boolean {
  // Implementation
}
```

### Documentation Tools

1. **VS Code Integration**
   - Install recommended extensions:
     - ESLint
     - Better Comments
     - Document This
     - TypeScript JSDoc Plugin
   - Auto-completion for JSDoc comments is enabled
   - Documentation warnings show in real-time

2. **Documentation Checker**
   Run the documentation analysis tool:
   ```bash
   npm run check-docs
   ```
   This will:
   - Analyze all TypeScript files for documentation issues
   - Generate a report in `docs/documentation-report.md`
   - List files needing documentation by priority

3. **ESLint Rules**
   The project uses ESLint with JSDoc and TypeScript plugins to enforce documentation standards:
   - Required JSDoc comments for functions and classes
   - Parameter and return type documentation
   - Description requirements
   - Type validation

### Adding Documentation

1. **For New Code**:
   - Add JSDoc comments before writing the implementation
   - Use VS Code's auto-complete suggestions
   - Include examples for complex functions
   - Run `npm run check-docs` before committing

2. **For Existing Code**:
   - Run the documentation checker to identify priority files
   - Add documentation progressively during modifications
   - Focus on exported and public interfaces first
   - Include context about complex logic

3. **Best Practices**:
   - Keep comments clear and concise
   - Explain the "why" not just the "what"
   - Update documentation when changing code
   - Include examples for non-obvious usage
   - Document edge cases and limitations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 