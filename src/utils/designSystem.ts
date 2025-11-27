/**
 * Design System Constants
 * Centralized design tokens for consistent styling across the application
 * Based on Requirements 7.1, 7.2, 12.2, 12.5
 */

// Color Palette
export const COLORS = {
  // Primary colors
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6', // Main primary
    600: '#2563EB',
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },
  
  // Status colors
  success: {
    50: '#F0FDF4',
    100: '#DCFCE7',
    500: '#10B981', // Main success
    700: '#047857',
  },
  
  warning: {
    50: '#FFFBEB',
    100: '#FEF3C7',
    500: '#F59E0B', // Main warning
    700: '#B45309',
  },
  
  danger: {
    50: '#FEF2F2',
    100: '#FEE2E2',
    500: '#EF4444', // Main danger
    700: '#B91C1C',
  },
  
  // Neutral colors
  neutral: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },
  
  // Category colors
  categories: {
    entertainment: '#3B82F6', // Blue
    productivity: '#10B981',  // Green
    health: '#EF4444',        // Red
    finance: '#F59E0B',       // Yellow
    general: '#6B7280',       // Gray
  },
} as const;

// Typography
export const TYPOGRAPHY = {
  fontFamily: {
    sans: "'Raleway', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif",
  },
  
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },
  
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

// Spacing
export const SPACING = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '0.75rem',   // 12px
  lg: '1rem',      // 16px
  xl: '1.5rem',    // 24px
  '2xl': '2rem',   // 32px
  '3xl': '3rem',   // 48px
  '4xl': '4rem',   // 64px
} as const;

// Border Radius
export const BORDER_RADIUS = {
  sm: '0.25rem',   // 4px
  md: '0.5rem',    // 8px
  lg: '0.75rem',   // 12px
  xl: '1rem',      // 16px
  '2xl': '1.5rem', // 24px
  full: '9999px',
} as const;

// Shadows
export const SHADOWS = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
} as const;

// Transitions
export const TRANSITIONS = {
  fast: '150ms',
  normal: '200ms',
  slow: '300ms',
  slower: '500ms',
} as const;

// Component-specific styles
export const COMPONENT_STYLES = {
  button: {
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost',
    error: 'btn btn-error',
    sizes: {
      sm: 'btn-sm',
      md: '',
      lg: 'btn-lg',
    },
  },
  
  input: {
    base: 'input input-bordered w-full bg-white',
    error: 'input-error',
    disabled: 'cursor-not-allowed opacity-50',
  },
  
  card: {
    base: 'card bg-white shadow-sm border border-gray-100',
    hover: 'hover:shadow-xl hover:border-gray-200 transition-all duration-300 transform hover:-translate-y-1',
  },
  
  badge: {
    base: 'badge',
    sizes: {
      sm: 'badge-sm',
      md: '',
      lg: 'badge-lg',
    },
    variants: {
      primary: 'badge-primary',
      success: 'badge-success',
      warning: 'badge-warning',
      error: 'badge-error',
    },
  },
  
  modal: {
    overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4',
    content: 'bg-white rounded-2xl p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl',
    animation: {
      enter: 'opacity-100 scale-100 translate-y-0',
      exit: 'opacity-0 scale-95 translate-y-4',
    },
  },
} as const;

// Category helpers
export const getCategoryColor = (category: string): string => {
  const normalizedCategory = category.toLowerCase();
  return COLORS.categories[normalizedCategory as keyof typeof COLORS.categories] || COLORS.categories.general;
};

export const getCategoryBadgeClasses = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return 'bg-blue-100 text-blue-700 border-blue-200';
    case 'productivity':
      return 'bg-green-100 text-green-700 border-green-200';
    case 'health':
      return 'bg-red-100 text-red-700 border-red-200';
    case 'finance':
      return 'bg-yellow-100 text-yellow-700 border-yellow-200';
    case 'general':
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
};

export const getCategoryIcon = (category: string): string => {
  switch (category.toLowerCase()) {
    case 'entertainment':
      return '🎬';
    case 'productivity':
      return '💼';
    case 'health':
      return '🏥';
    case 'finance':
      return '💰';
    case 'general':
    default:
      return '📋';
  }
};

// Status helpers
export const getStatusColor = (isActive: boolean, daysLeft: number): string => {
  if (!isActive) return COLORS.neutral[400];
  if (daysLeft === 0) return COLORS.danger[500];
  if (daysLeft <= 10) return COLORS.warning[500];
  return COLORS.success[500];
};

export const getStatusBadgeClasses = (isActive: boolean, daysLeft: number): string => {
  if (!isActive) return 'bg-gray-100 text-gray-700';
  if (daysLeft === 0) return 'bg-red-100 text-red-700';
  if (daysLeft <= 10) return 'bg-yellow-100 text-yellow-700';
  return 'bg-green-100 text-green-700';
};

export const getStatusText = (isActive: boolean, daysLeft: number): string => {
  if (!isActive) return 'Inactive';
  if (daysLeft === 0) return 'Expired';
  if (daysLeft <= 10) return 'Expiring Soon';
  return 'Active';
};
