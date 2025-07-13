# MOCEAN Design System

## Overview

The MOCEAN Design System provides a unified, consistent, and accessible design foundation for the entire application. It establishes design tokens, component patterns, and best practices to ensure a cohesive user experience.

## Design Tokens

### Colors

#### Primary Colors
- `--color-primary-50` to `--color-primary-900`: Blue-based primary palette
- Used for: Buttons, links, focus states, active elements

#### Secondary Colors
- `--color-secondary-50` to `--color-secondary-900`: Gray-based neutral palette
- Used for: Text, backgrounds, borders, disabled states

#### Semantic Colors
- **Success**: `--color-success-500` (#22c55e) - Positive actions, completed states
- **Warning**: `--color-warning-500` (#f59e0b) - Caution states, medium priority
- **Error**: `--color-error-500` (#ef4444) - Errors, destructive actions

### Typography

#### Font Families
- **Sans**: `Inter` (primary), system fallbacks
- **Mono**: `JetBrains Mono` (for code, metrics)

#### Font Sizes
- `--text-xs`: 0.75rem (12px)
- `--text-sm`: 0.875rem (14px)
- `--text-base`: 1rem (16px)
- `--text-lg`: 1.125rem (18px)
- `--text-xl`: 1.25rem (20px)
- `--text-2xl`: 1.5rem (24px)
- `--text-3xl`: 1.875rem (30px)
- `--text-4xl`: 2.25rem (36px)

#### Font Weights
- `--font-light`: 300
- `--font-normal`: 400
- `--font-medium`: 500
- `--font-semibold`: 600
- `--font-bold`: 700

### Spacing

#### Scale
- `--space-1`: 0.25rem (4px)
- `--space-2`: 0.5rem (8px)
- `--space-3`: 0.75rem (12px)
- `--space-4`: 1rem (16px)
- `--space-5`: 1.25rem (20px)
- `--space-6`: 1.5rem (24px)
- `--space-8`: 2rem (32px)
- `--space-10`: 2.5rem (40px)
- `--space-12`: 3rem (48px)
- `--space-16`: 4rem (64px)
- `--space-20`: 5rem (80px)

### Border Radius

- `--radius-sm`: 0.25rem (4px)
- `--radius-md`: 0.375rem (6px)
- `--radius-lg`: 0.5rem (8px)
- `--radius-xl`: 0.75rem (12px)
- `--radius-2xl`: 1rem (16px)
- `--radius-full`: 9999px (circular)

### Shadows

- `--shadow-sm`: Subtle elevation
- `--shadow-md`: Default elevation
- `--shadow-lg`: High elevation
- `--shadow-xl`: Maximum elevation

### Transitions

- `--transition-fast`: 150ms ease-in-out
- `--transition-normal`: 250ms ease-in-out
- `--transition-slow`: 350ms ease-in-out

## Component Library

### Buttons

```jsx
// Primary button
<button className="btn btn-primary">Primary Action</button>

// Secondary button
<button className="btn btn-secondary">Secondary Action</button>

// Ghost button
<button className="btn btn-ghost">Ghost Action</button>

// Sizes
<button className="btn btn-primary btn-sm">Small</button>
<button className="btn btn-primary">Default</button>
<button className="btn btn-primary btn-lg">Large</button>
```

### Form Components

```jsx
// Form field wrapper
<div className="form-field">
  <label className="form-label">Field Label</label>
  <input className="form-input" type="text" />
  <span className="form-error">Error message</span>
</div>
```

### Chips/Tags

```jsx
// Default chip
<Chip label="Option 1" active={false} onClick={handleClick} />

// Active chip
<Chip label="Option 2" active={true} onClick={handleClick} />

// Variants
<Chip label="Outline" variant="outline" />
<Chip label="Ghost" variant="ghost" />

// Sizes
<Chip label="Small" size="sm" />
<Chip label="Large" size="lg" />
```

### Cards

```jsx
// Basic card
<Card>
  <Card.Header>
    <h3>Card Title</h3>
  </Card.Header>
  <Card.Body>
    <p>Card content goes here</p>
  </Card.Body>
  <Card.Footer>
    <button className="btn btn-primary">Action</button>
  </Card.Footer>
</Card>

// Variants
<Card variant="elevated" shadow="lg" />
<Card variant="outlined" border={true} />
<Card variant="ghost" shadow="none" />
```

### Progress Indicator

```jsx
<Progress step={2} total={5} />
```

### Sliders

```jsx
<SliderRow
  id="energy"
  value={7}
  onChange={handleChange}
  question="How is your energy level?"
  low="Exhausted"
  high="Boundless"
  min={0}
  max={10}
/>
```

## Layout System

### Container

```jsx
<div className="container">
  {/* Content with max-width and centered */}
</div>
```

### Grid

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Responsive grid items */}
</div>
```

### Spacing Utilities

```jsx
// Vertical spacing
<div className="space-y-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// Horizontal spacing
<div className="flex space-x-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

## Accessibility Guidelines

### Focus Management
- All interactive elements must be keyboard accessible
- Use `focus-visible` for consistent focus indicators
- Maintain logical tab order

### Color Contrast
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text
- Don't rely solely on color to convey information

### Screen Readers
- Use semantic HTML elements
- Provide descriptive `aria-label` attributes
- Use `aria-pressed` for toggle states
- Use `aria-expanded` for collapsible content

### Motion
- Respect `prefers-reduced-motion` preference
- Provide alternative content for animations
- Keep animations under 300ms for better UX

## Responsive Design

### Breakpoints
- **Mobile**: < 640px
- **Tablet**: 640px - 768px
- **Desktop**: 768px - 1024px
- **Large Desktop**: > 1024px

### Mobile-First Approach
```css
/* Base styles (mobile) */
.component { /* mobile styles */ }

/* Tablet and up */
@media (min-width: 640px) {
  .component { /* tablet styles */ }
}

/* Desktop and up */
@media (min-width: 768px) {
  .component { /* desktop styles */ }
}
```

## Best Practices

### Component Design
1. **Single Responsibility**: Each component should have one clear purpose
2. **Composition**: Use composition over inheritance
3. **Props Interface**: Define clear, typed props
4. **Default Values**: Provide sensible defaults
5. **Error Handling**: Gracefully handle edge cases

### Styling Guidelines
1. **Use Design Tokens**: Always use CSS custom properties
2. **Consistent Spacing**: Use the spacing scale
3. **Semantic Colors**: Use semantic color names
4. **Responsive**: Design for all screen sizes
5. **Accessible**: Follow WCAG guidelines

### Performance
1. **CSS-in-JS**: Avoid runtime CSS generation
2. **Bundle Size**: Keep components lightweight
3. **Lazy Loading**: Load components when needed
4. **Optimization**: Use CSS containment where appropriate

## Migration Guide

### From Old Components
1. Replace custom button styles with `.btn` classes
2. Update form inputs to use `.form-input`
3. Replace custom chips with `<Chip>` component
4. Use `<Card>` component for content containers
5. Update progress indicators to use `<Progress>`

### CSS Classes
- Replace `bg-blue-600` with `bg-primary-600`
- Replace `text-gray-700` with `text-secondary-700`
- Replace custom padding with spacing utilities
- Use design system shadows instead of custom ones

## Future Enhancements

### Planned Features
- Dark mode support
- High contrast mode
- RTL language support
- Animation library
- Icon system
- Data visualization components

### Contributing
1. Follow the established patterns
2. Update documentation
3. Test across devices and browsers
4. Ensure accessibility compliance
5. Get design review for new components 