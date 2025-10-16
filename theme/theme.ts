import { designTokens } from './design-tokens';

/**
 * Theme utility functions for accessing design tokens
 */
export const theme = {
  // Color utilities
  colors: {
    primary: (shade: keyof typeof designTokens.color.brand.primary = 500) => 
      designTokens.color.brand.primary[shade],
    secondary: (shade: keyof typeof designTokens.color.brand.secondary = 500) => 
      designTokens.color.brand.secondary[shade],
    error: designTokens.color.semantic.error,
    warning: designTokens.color.semantic.warning,
    success: designTokens.color.semantic.success,
    neutral: designTokens.color.neutral,
  },

  // Typography utilities
  typography: {
    fontSize: designTokens.font.size,
    fontWeight: designTokens.font.weight,
    lineHeight: designTokens.font.lineHeight,
    letterSpacing: designTokens.font.letterSpacing,
  },

  // Spacing utilities
  spacing: designTokens.space,

  // Border radius utilities
  radius: designTokens.radius,

  // Shadow utilities  
  shadows: designTokens.shadow,
};

/**
 * CSS class name generators for consistent styling
 */
export const themeClasses = {
  // Typography classes
  heading: {
    h1: 'text-h1 font-bold leading-tight text-text-primary',
    h2: 'text-h2 font-bold leading-tight text-text-primary', 
    h3: 'text-h3 font-semibold leading-tight text-text-primary',
  },
  
  text: {
    body: 'text-body leading-normal text-text-primary',
    secondary: 'text-body leading-normal text-text-secondary',
    small: 'text-small leading-normal text-text-secondary',
    disabled: 'text-body leading-normal text-text-disabled',
  },

  // Button variants
  button: {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
    secondary: 'bg-secondary-600 text-white hover:bg-secondary-700 focus:ring-secondary-500',
    outline: 'border border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'text-primary-600 hover:bg-primary-50',
    danger: 'bg-error text-white hover:bg-red-700',
    success: 'bg-success text-white hover:bg-green-700',
  },

  // Surface variants
  surface: {
    default: 'bg-background',
    elevated: 'bg-surface',
    card: 'bg-background border border-border shadow-sm',
  },

  // Status variants
  status: {
    error: 'text-error border-error bg-red-50',
    warning: 'text-warning border-yellow-300 bg-yellow-50', 
    success: 'text-success border-green-300 bg-green-50',
  }
};

/**
 * Responsive breakpoints
 */
export const breakpoints = {
  sm: '640px',
  md: '768px', 
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

/**
 * Animation presets
 */
export const animations = {
  transition: {
    fast: 'transition-all duration-150 ease-in-out',
    normal: 'transition-all duration-300 ease-in-out',
    slow: 'transition-all duration-500 ease-in-out',
  },
  
  hover: {
    scale: 'hover:scale-105 transition-transform duration-200',
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
  }
};