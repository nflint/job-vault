# JobVault UI Components Usage Guide

This guide provides detailed instructions on how to use the JobVault UI component system effectively. Our components are designed to provide a consistent, accessible, and responsive user interface across the application.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Page Layout](#page-layout)
3. [Sections](#sections)
4. [Cards](#cards)
5. [Timeline Cards](#timeline-cards)
6. [Common Patterns](#common-patterns)
7. [Migration Guide](#migration-guide)

## Getting Started

All components are available in the `components/ui` directory. Import them as needed:

```tsx
import { PageLayout } from '@/components/ui/page-layout'
import { Section } from '@/components/ui/section'
import { ContentCard } from '@/components/ui/card-content'
import { TimelineCard } from '@/components/ui/timeline-card'
```

## Page Layout

The `PageLayout` component provides a consistent page structure with optional title, description, and actions.

### Basic Usage

```tsx
import { PageLayout } from '@/components/ui/page-layout'
import { Button } from '@/components/ui/button'

export default function MyPage() {
  return (
    <PageLayout
      title="My Page"
      description="This is a description of my page"
      actions={
        <Button>
          Add New
        </Button>
      }
    >
      {/* Page content */}
    </PageLayout>
  )
}
```

### Props

- `title?: string` - Page title
- `description?: string` - Page description
- `actions?: ReactNode` - Action buttons/elements for the header
- `className?: string` - Additional classes for the container
- `contentClassName?: string` - Additional classes for the main content area

### Best Practices

1. Always provide a descriptive title
2. Keep descriptions concise and informative
3. Place primary actions in the header
4. Use consistent action placement across pages

## Sections

The `Section` component helps organize content within pages.

### Basic Usage

```tsx
import { Section } from '@/components/ui/section'
import { Button } from '@/components/ui/button'

<Section
  title="Work Experience"
  description="Your professional history"
  actions={
    <Button variant="outline">
      Add Experience
    </Button>
  }
>
  {/* Section content */}
</Section>
```

### Props

- `title?: string` - Section title
- `description?: string` - Section description
- `actions?: ReactNode` - Action buttons/elements
- `className?: string` - Additional classes for the section
- `contentClassName?: string` - Additional classes for the content area

### Best Practices

1. Use sections to group related content
2. Keep section titles clear and concise
3. Place section-specific actions in the section header
4. Maintain consistent spacing between sections

## Cards

The `ContentCard` component extends shadcn/ui's Card component with our standard structure.

### Basic Usage

```tsx
import { ContentCard } from '@/components/ui/card-content'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

<ContentCard
  title="Software Engineer"
  description="Company Name"
  actions={
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  }
  footer={
    <div className="flex justify-end">
      <Button variant="outline">View Details</Button>
    </div>
  }
>
  {/* Card content */}
</ContentCard>
```

### Props

- `title?: string` - Card title
- `description?: string` - Card description
- `actions?: ReactNode` - Action buttons/elements
- `footer?: ReactNode` - Footer content
- `className?: string` - Additional classes for the card
- `contentClassName?: string` - Additional classes for the content area

### Best Practices

1. Use cards for self-contained content units
2. Keep card actions consistent across similar cards
3. Use the footer for secondary actions
4. Maintain consistent padding and spacing

## Timeline Cards

The `TimelineCard` component is specialized for timeline views, extending `ContentCard` with timeline-specific styling.

### Basic Usage

```tsx
import { TimelineCard } from '@/components/ui/timeline-card'
import { Button } from '@/components/ui/button'
import { Pencil } from 'lucide-react'

<TimelineCard
  title="Project Lead"
  description="2022 - Present"
  actions={
    <Button variant="ghost" size="icon">
      <Pencil className="h-4 w-4" />
    </Button>
  }
  markerClassName="bg-blue-500"
>
  {/* Timeline entry content */}
</TimelineCard>
```

### Props

Extends `ContentCard` props with:
- `markerClassName?: string` - Additional classes for the timeline marker
- `showMarker?: boolean` - Whether to show the timeline marker (default: true)

### Best Practices

1. Use consistent marker colors for similar types of entries
2. Maintain chronological order in timeline views
3. Use clear date formatting in descriptions
4. Group related timeline entries appropriately

## Common Patterns

### Combining Components

```tsx
<PageLayout title="Professional History">
  <Section title="Work Experience">
    <div className="space-y-6">
      <TimelineCard
        title="Senior Developer"
        description="2023 - Present"
      >
        {/* Job details */}
      </TimelineCard>
      <TimelineCard
        title="Developer"
        description="2020 - 2023"
      >
        {/* Job details */}
      </TimelineCard>
    </div>
  </Section>
</PageLayout>
```

### Loading States

```tsx
<PageLayout>
  <Section>
    <ContentCard>
      {isLoading ? (
        <div className="flex items-center justify-center p-6">
          <Spinner />
        </div>
      ) : (
        {/* Content */}
      )}
    </ContentCard>
  </Section>
</PageLayout>
```

### Empty States

```tsx
<Section title="Projects">
  {projects.length === 0 ? (
    <ContentCard>
      <div className="flex flex-col items-center justify-center p-6 text-center">
        <FolderPlus className="h-12 w-12 text-muted-foreground" />
        <h3 className="mt-4 text-lg font-semibold">No Projects Yet</h3>
        <p className="text-muted-foreground">Add your first project to get started</p>
        <Button className="mt-4">Add Project</Button>
      </div>
    </ContentCard>
  ) : (
    {/* Project list */}
  )}
</Section>
```

## Migration Guide

When updating existing pages to use the new component system:

1. Replace page containers with `PageLayout`
2. Convert content sections to use `Section`
3. Update cards to use `ContentCard` or `TimelineCard`
4. Ensure consistent spacing using the spacing standards
5. Update typography to match the standards
6. Implement responsive patterns as needed

### Example Migration

Before:
```tsx
<div className="container">
  <h1>My Page</h1>
  <div className="content">
    <div className="section">
      <h2>Section Title</h2>
      <div className="card">
        {/* Content */}
      </div>
    </div>
  </div>
</div>
```

After:
```tsx
<PageLayout title="My Page">
  <Section title="Section Title">
    <ContentCard>
      {/* Content */}
    </ContentCard>
  </Section>
</PageLayout>
```

Remember to:
- Preserve existing functionality while migrating
- Test responsive behavior
- Maintain accessibility features
- Update any component-specific styling
- Keep consistent action placement 