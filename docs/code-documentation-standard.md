# Code Documentation Standards

## File Header Template
```typescript
/**
 * @fileoverview [Brief description of the file's purpose]
 * 
 * [More detailed description if needed]
 * 
 * @author [Optional]
 * @lastModified [YYYY-MM-DD]
 */
```

## Component Documentation Template
```typescript
/**
 * @component [ComponentName]
 * 
 * @description
 * [Detailed description of the component's purpose and functionality]
 * 
 * @props {[type]} propName - [Description of the prop]
 * 
 * @returns {JSX.Element} Component's rendered content
 * 
 * @example
 * // Basic usage:
 * <ComponentName prop={value} />
 */
export default function ComponentName(): JSX.Element {
  // Implementation
}
```

## Function Documentation Template
```typescript
/**
 * [Brief description of what the function does]
 * 
 * @param {[type]} paramName - [Parameter description]
 * @returns {[type]} - [Description of return value]
 * @throws {[error type]} - [Description of when this error occurs]
 * 
 * @example
 * // Example usage:
 * const result = functionName(params);
 */
```

## Implementation Guidelines

1. All new files must include the file header documentation
2. All exported functions, classes, and interfaces must be documented
3. All React components must:
   - Include explicit return type `: JSX.Element`
   - Have comprehensive prop documentation
   - Include usage examples where appropriate
4. Internal helper functions should have at least a brief comment explaining their purpose
5. Complex logic sections should include inline comments explaining the "why" not the "what"
6. Update documentation when making significant changes to code
7. Include any important notes about side effects or dependencies

## Best Practices

1. Keep comments clear and concise
2. Focus on explaining "why" rather than "what" for inline comments
3. Keep documentation up to date with code changes
4. Use consistent formatting and style
5. Include examples for complex functionality
6. Document error cases and edge conditions
7. Note any performance implications or limitations

## Component-Specific Standards

1. **Return Types**:
   ```typescript
   // Always include explicit return type
   export default function Component(): JSX.Element {
     // Implementation
   }
   ```

2. **Props Interface**:
   ```typescript
   /**
    * Props for ComponentName
    * @interface
    */
   interface ComponentNameProps {
     /** Description of the prop */
     propName: PropType
   }
   ```

3. **Component Structure**:
   - File header documentation
   - Props interface (if any)
   - Component documentation
   - Component implementation
   - Subcomponents (if any)

## VSCode Setup

Recommended VSCode extensions for documentation:
- Better Comments
- Document This
- TypeScript JSDoc Plugin

## Automation

Consider using tools like:
- ESLint with documentation rules
- Prettier for consistent formatting
- TypeDoc for generating documentation

## Review Process

Documentation should be reviewed as part of the code review process, checking for:
1. Completeness
2. Accuracy
3. Clarity
4. Consistency with standards 