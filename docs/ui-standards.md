# JobVault UI Standards Guide

## Layout Standards

### Page Layout
```tsx
<div className="container mx-auto p-6 space-y-6">
  <header className="flex justify-between items-center">
    <h1 className="text-3xl font-bold">Page Title</h1>
    <Actions />
  </header>
  <main>
    <Content />
  </main>
</div>
```

### Section Layout
```tsx
<section className="space-y-4">
  <div className="flex justify-between items-center">
    <h2 className="text-2xl font-semibold">Section Title</h2>
    <SectionActions />
  </div>
  <Content />
</section>
```

## Component Standards

### Cards
```tsx
// Standard Card
<Card className="p-6">
  <div className="flex justify-between items-start">
    <div className="space-y-1">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
    <CardActions />
  </div>
</Card>

// Timeline Card
<div className="relative pl-8">
  <div className="absolute left-0 top-4 w-4 h-4 rounded-full bg-primary" />
  <Card className="p-6">
    {/* Card content */}
  </Card>
</div>
```

### Action Buttons
```tsx
// Primary Action
<Button>
  <Plus className="h-4 w-4 mr-2" />
  Add Item
</Button>

// Secondary Actions
<Button variant="ghost" size="icon">
  <Pencil className="h-4 w-4" />
</Button>

// Destructive Actions
<Button variant="ghost" size="icon" className="text-destructive">
  <Trash2 className="h-4 w-4" />
</Button>
```

### Form Fields
```tsx
<FormField
  control={form.control}
  name="fieldName"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Field Label</FormLabel>
      <FormControl>
        <Input {...field} />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

### Status Indicators
```tsx
// Badge Status
<Badge variant="outline" className="text-xs">
  {status}
</Badge>

// Colored Status
<Badge 
  variant="secondary"
  className={cn({
    'bg-green-100 text-green-800': status === 'active',
    'bg-yellow-100 text-yellow-800': status === 'pending',
    'bg-red-100 text-red-800': status === 'inactive'
  })}
>
  {status}
</Badge>
```

### Modals/Dialogs
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open Modal</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Modal Title</DialogTitle>
      <DialogDescription>
        Modal description or context
      </DialogDescription>
    </DialogHeader>
    <div className="space-y-4">
      {/* Modal content */}
    </div>
    <DialogFooter>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
      <Button onClick={onConfirm}>
        Confirm
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

## Spacing Standards

- Page padding: `p-6`
- Section spacing: `space-y-6`
- Card padding: `p-6`
- Form field spacing: `space-y-4`
- Button icon spacing: `mr-2` (for text + icon)
- Flex item gaps: `gap-2` or `gap-4`

## Typography Standards

- Page titles: `text-3xl font-bold`
- Section titles: `text-2xl font-semibold`
- Card titles: `text-lg font-semibold`
- Body text: `text-base`
- Muted text: `text-muted-foreground`
- Small text: `text-sm`
- Micro text: `text-xs`

## Color Standards

Use semantic color tokens from our theme:

- Primary actions: `bg-primary text-primary-foreground`
- Secondary actions: `bg-secondary text-secondary-foreground`
- Destructive actions: `bg-destructive text-destructive-foreground`
- Muted elements: `text-muted-foreground`
- Borders: `border-border`
- Accents: `bg-accent text-accent-foreground`

## Animation Standards

Use the built-in animation classes:

- Hover transitions: `transition-colors`
- Fade in: `animate-in fade-in`
- Slide up: `animate-in slide-in-from-bottom`
- Scale: `animate-in zoom-in`

## Responsive Design

- Container: `container mx-auto`
- Mobile-first approach
- Grid columns: 
  ```tsx
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  ```
- Stack on mobile:
  ```tsx
  <div className="flex flex-col md:flex-row gap-4">
  ```

## Best Practices

1. Always use semantic HTML elements
2. Maintain consistent spacing using the spacing standards
3. Use Tailwind's built-in design tokens
4. Follow mobile-first responsive design
5. Use shadcn/ui components as base components
6. Maintain consistent action placement
7. Use appropriate loading and error states
8. Implement proper focus management
9. Ensure proper color contrast
10. Maintain consistent animation timing 