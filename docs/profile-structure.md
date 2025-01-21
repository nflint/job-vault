# Profile Structure

## Route & UI Organization

```
/profile
├── /                               # Profile Overview Dashboard (Single Page)
│   ├── Quick Stats
│   ├── Completion Status
│   ├── Recent Updates
│   └── Quick Actions
│
├── /professional-history           # Professional History (Tabbed Interface)
│   ├── /experience                # Tab: Work Experience
│   ├── /education                 # Tab: Education
│   ├── /projects                  # Tab: Projects
│   └── /certifications            # Tab: Certifications
│
├── /skills                         # Skills Dashboard (Single Page)
│   ├── Skill Matrix
│   ├── Category View
│   └── Proficiency Management
│
└── /settings                       # Settings (Tabbed Interface)
    ├── /account                    # Tab: Account Settings
    ├── /appearance                # Tab: Appearance
    ├── /notifications             # Tab: Notifications
    ├── /privacy                   # Tab: Privacy
    └── /integrations              # Tab: Integrations
```

## Page Layouts

### 1. Profile Overview (`/profile`)
**Single Page Dashboard Layout**
- Profile completion progress bar
- Quick action buttons
  - Add new experience
  - Update skills
  - Generate resume
- Recent activity feed
- Profile visibility status
- LinkedIn connection status
- Quick stats summary

### 2. Professional History (`/profile/professional-history`)
**Tabbed Interface with Shared Timeline**
- Persistent timeline view across tabs
- Tab navigation:
  1. **Experience Tab**
     - Work history timeline
     - Company details
     - Role descriptions
     - Achievements
  
  2. **Education Tab**
     - Education timeline
     - Degrees and certifications
     - Academic achievements
  
  3. **Projects Tab**
     - Project portfolio grid
     - Technical details
     - Results showcase
  
  4. **Certifications Tab**
     - Certification timeline
     - License management
     - Renewal tracking

### 3. Skills Management (`/profile/skills`)
**Single Page Grid Layout**
- Skill matrix visualization
- Category-based organization
- Proficiency level indicators
- Search and filter options
- Quick edit capabilities
- Skill trend analysis

### 4. Settings (`/profile/settings`)
**Tabbed Interface**
- Standard settings layout
- Tab-based navigation
- Consistent form patterns
- Save/cancel actions
- Real-time validation

## Shared UI Elements

### Navigation
- Breadcrumb navigation
- Section tabs where applicable
- Quick navigation sidebar
- Mobile-responsive menu

### Interactive Elements
- Rich text editors
- Drag-and-drop interfaces
- In-line editing
- Auto-save functionality
- Version history access

### Data Display
- Timeline visualizations
- Progress indicators
- Achievement metrics
- Skill proficiency charts
- Status indicators

## Mobile Considerations
- Collapsible sections
- Bottom navigation for tabs
- Responsive grids
- Touch-friendly interactions
- Simplified views for complex data

---
## Implementation Notes
- Use Next.js App Router for navigation
- Implement loading states for each section
- Add error boundaries per route
- Use ShadcnUI tabs component for consistency
- Maintain state separately for each tab
- Implement optimistic updates
- Use skeleton loaders for initial loads
- Add scroll position restoration

## Feature Organization

### 1. Profile Overview (`/profile`)
- Profile completion status
- Quick actions for common tasks
- Recent updates
- Profile visibility settings
- LinkedIn connection status
- Profile export options

### 2. Professional History (`/profile/professional-history`)
- Timeline view of all professional experiences
- Drag-and-drop organization
- Rich text editing for descriptions
- Achievement tracking
- Version history
- Import/Export functionality

#### Work Experience (`/profile/professional-history/experience`)
- Detailed company information
- Role descriptions
- Achievement metrics
- Technology stack used
- Impact measurements

#### Education (`/profile/professional-history/education`)
- Academic history
- Degrees and certifications
- Academic achievements
- Relevant coursework
- GPA and honors

#### Projects (`/profile/professional-history/projects`)
- Project portfolio
- Technical details
- Results and metrics
- Live demos/links
- Technology stack

#### Certifications (`/profile/professional-history/certifications`)
- Professional certifications
- Licenses
- Continuing education
- Expiration tracking

### 3. Skills Management (`/profile/skills`)
- Skill categorization
- Proficiency levels
- Years of experience
- Last used dates
- Skill endorsements
- Technology trends

### 4. Profile Settings (`/profile/settings`)
#### Account Settings (`/profile/settings/account`)
- User account management (existing)
- Email preferences
- Password management
- Two-factor authentication
- Account deletion

#### Appearance (`/profile/settings/appearance`)
- Theme preferences (existing)
- Dark/light mode toggle
- Custom color schemes
- Layout preferences

#### Notifications (`/profile/settings/notifications`)
- Email notification preferences
- Application status updates
- Profile change alerts
- Job match notifications
- Resume view notifications

#### Privacy (`/profile/settings/privacy`)
- Profile visibility controls
- Data sharing preferences
- Resume privacy settings
- Job application privacy
- Profile indexing preferences

#### Integrations (`/profile/settings/integrations`)
- LinkedIn connection
- Other job board integrations
- Calendar integration
- Export/Import settings
- API access management

## Component Organization

### Shared Components
- Rich text editor
- Timeline visualizer
- Skill matrix
- Achievement metrics dashboard
- Version history viewer
- Import/Export wizards

### Page-Specific Components
- Profile completion indicator
- Professional history timeline
- Skill proficiency chart
- Project portfolio grid
- Education timeline
- Certification tracker

## Data Flow

1. Profile data serves as the single source of truth
2. Resume builder pulls data from profile sections
3. Job applications can auto-fill from profile data
4. LinkedIn sync bi-directionally updates profile data
5. AI features analyze profile data for suggestions

## Integration Points

### With Job Tracker
- Auto-fill job applications
- Match skills with job requirements
- Track which parts of profile were used in applications
- Suggest profile updates based on job applications

### With Resume Builder
- Generate resumes from profile sections
- Track which profile versions were used in resumes
- Suggest profile updates based on resume performance
- Template matching based on profile content

---
## Notes
- All routes are protected and require authentication
- Profile data is the foundation for resume generation
- Changes are tracked with version history
- AI features are integrated throughout for suggestions
- Mobile-responsive design for all views
- Real-time updates and auto-saving 