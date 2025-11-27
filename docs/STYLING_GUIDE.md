# Styling Guide

This document outlines the consistent styling patterns used across the Subscription Manager application.

## Design System

The application uses a centralized design system defined in `src/utils/designSystem.ts` to ensure consistency across all components.

### Color Palette

#### Primary Colors
- **Blue (#3B82F6)**: Main brand color, used for primary actions and accents
- **Green (#10B981)**: Success states, active subscriptions
- **Yellow (#F59E0B)**: Warning states, expiring subscriptions
- **Red (#EF4444)**: Error states, expired subscriptions, delete actions
- **Gray (#6B7280)**: Neutral elements, inactive states

#### Category Colors
- **Entertainment**: Blue (#3B82F6)
- **Productivity**: Green (#10B981)
- **Health**: Red (#EF4444)
- **Finance**: Yellow (#F59E0B)
- **General**: Gray (#6B7280)

### Typography

**Font Family**: Raleway (Google Fonts) with system font fallbacks
```css
font-family: 'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
```

**Font Sizes**:
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)
- 5xl: 3rem (48px)
- 6xl: 3.75rem (60px)

**Font Weights**:
- Normal: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing

Base unit: 4px (0.25rem)

Common spacing values:
- xs: 0.25rem (4px)
- sm: 0.5rem (8px)
- md: 0.75rem (12px)
- lg: 1rem (16px)
- xl: 1.5rem (24px)
- 2xl: 2rem (32px)
- 3xl: 3rem (48px)
- 4xl: 4rem (64px)

### Border Radius

- sm: 0.25rem (4px)
- md: 0.5rem (8px)
- lg: 0.75rem (12px)
- xl: 1rem (16px)
- 2xl: 1.5rem (24px)
- full: 9999px (circular)

### Shadows

- sm: Subtle shadow for slight elevation
- md: Standard shadow for cards
- lg: Prominent shadow for modals
- xl: Deep shadow for floating elements
- 2xl: Maximum shadow for emphasis

## Component Styling Patterns

### Buttons (FlyonUI)

All buttons use FlyonUI classes for consistency:

```tsx
// Primary button
<button className="btn btn-primary">Add Subscription</button>

// Secondary button
<button className="btn btn-secondary">Cancel</button>

// Outline button
<button className="btn btn-outline">View More</button>

// Ghost button
<button className="btn btn-ghost">Close</button>

// Error/Danger button
<button className="btn btn-error">Delete</button>

// Button sizes
<button className="btn btn-sm">Small</button>
<button className="btn">Medium (default)</button>
<button className="btn btn-lg">Large</button>

// Button with icon
<button className="btn btn-primary gap-2">
  <svg>...</svg>
  Add Item
</button>
```

### Form Inputs (FlyonUI)

```tsx
// Standard input
<input className="input input-bordered w-full bg-white" />

// Input with error
<input className="input input-bordered input-error w-full bg-white" />

// Disabled input
<input className="input input-bordered w-full bg-white cursor-not-allowed opacity-50" disabled />

// Label
<label className="label">
  <span className="label-text font-semibold">Field Name</span>
</label>
```

### Cards (FlyonUI)

```tsx
// Standard card
<div className="card bg-white shadow-sm border border-gray-100">
  <div className="card-body p-6">
    {/* Content */}
  </div>
</div>

// Card with hover effect
<div className="card bg-white shadow-sm border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1">
  <div className="card-body p-6">
    {/* Content */}
  </div>
</div>
```

### Badges (FlyonUI)

```tsx
// Standard badge
<span className="badge">General</span>

// Badge sizes
<span className="badge badge-sm">Small</span>
<span className="badge">Medium</span>
<span className="badge badge-lg">Large</span>

// Badge variants
<span className="badge badge-primary">Primary</span>
<span className="badge badge-success">Success</span>
<span className="badge badge-warning">Warning</span>
<span className="badge badge-error">Error</span>

// Category badge (custom colors)
<span className="badge badge-sm font-medium bg-blue-100 text-blue-700 border-blue-200">
  Entertainment
</span>
```

### Modals

```tsx
// Modal overlay
<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out">
  {/* Modal content */}
  <div className="bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl">
    <h2 className="text-2xl font-bold text-gray-900 mb-6">Modal Title</h2>
    {/* Modal body */}
  </div>
</div>
```

### Status Indicators

Use the design system helper functions:

```tsx
import { getStatusBadgeClasses, getStatusText } from '../utils/designSystem';

// Status badge
<span className={`badge gap-1 ${getStatusBadgeClasses(isActive, daysLeft)}`}>
  <span className="w-2 h-2 rounded-full bg-green-500"></span>
  {getStatusText(isActive, daysLeft)}
</span>
```

### Category Display

Use the design system helper functions:

```tsx
import { getCategoryBadgeClasses, getCategoryIcon } from '../utils/designSystem';

// Category badge
<span className={`badge badge-sm font-medium ${getCategoryBadgeClasses(category)}`}>
  {category}
</span>

// Category with icon
<div className="flex items-center gap-2">
  <span className="text-xl">{getCategoryIcon(category)}</span>
  <span className={`badge badge-lg font-medium border ${getCategoryBadgeClasses(category)}`}>
    {category}
  </span>
</div>
```

## Layout Patterns

### Page Container

```tsx
<div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    {/* Page content */}
  </div>
</div>
```

### Header Section

```tsx
<header className="mb-12">
  <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-8">
    <div className="flex-1">
      <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 mb-3 tracking-tight leading-tight">
        Page Title
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl leading-relaxed font-medium">
        Page description
      </p>
    </div>
    <div className="flex-shrink-0">
      <button className="btn btn-primary btn-lg">Action</button>
    </div>
  </div>
</header>
```

### Grid Layout

```tsx
// Responsive grid for cards
<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
  {items.map(item => (
    <div key={item.id}>
      {/* Card content */}
    </div>
  ))}
</div>
```

## Animations

### Fade In

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fade-in 0.5s ease-out forwards;
}
```

### Fade In Up (for grid items)

```css
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
```

### Slide In (for toasts)

```css
@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
```

## Accessibility

### Focus States

All interactive elements should have visible focus states:

```tsx
// Button focus
<button className="btn btn-primary focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Click Me
</button>

// Input focus
<input className="input input-bordered focus:ring-2 focus:ring-blue-500" />
```

### ARIA Labels

Always include ARIA labels for icon-only buttons:

```tsx
<button
  className="btn btn-circle btn-sm"
  aria-label="Delete subscription"
>
  <svg>...</svg>
</button>
```

### Color Contrast

Ensure all text meets WCAG AA standards:
- Normal text: 4.5:1 contrast ratio
- Large text (18px+): 3:1 contrast ratio

## Best Practices

1. **Use FlyonUI Components**: Always use FlyonUI classes for buttons, inputs, cards, and badges
2. **Consistent Spacing**: Use the spacing scale defined in the design system
3. **Typography Hierarchy**: Maintain clear visual hierarchy with consistent font sizes and weights
4. **Color Usage**: Use colors from the design system palette
5. **Responsive Design**: Test all components on mobile, tablet, and desktop
6. **Accessibility**: Include proper ARIA labels and ensure keyboard navigation works
7. **Animations**: Use subtle animations for better UX (200-300ms transitions)
8. **Helper Functions**: Use design system helper functions for status and category styling

## Component Checklist

When creating or updating components, ensure:

- [ ] Uses FlyonUI classes for UI elements
- [ ] Follows spacing scale from design system
- [ ] Uses colors from design system palette
- [ ] Includes proper typography hierarchy
- [ ] Has responsive design (mobile, tablet, desktop)
- [ ] Includes ARIA labels for accessibility
- [ ] Has proper focus states
- [ ] Uses design system helper functions where applicable
- [ ] Includes smooth transitions/animations
- [ ] Maintains consistent border radius
- [ ] Uses appropriate shadows for elevation

## References

- Design System: `src/utils/designSystem.ts`
- FlyonUI Documentation: https://flyonui.com/
- Tailwind CSS: https://tailwindcss.com/
- WCAG Guidelines: https://www.w3.org/WAI/WCAG21/quickref/
