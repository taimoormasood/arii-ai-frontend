import { designTokens } from './design-tokens';

/**
 * Theme configuration for Tailwind CSS v4
 * Converts design tokens to Tailwind-compatible format
 */
export const themeConfig = {
  colors: {
    // Brand colors
    primary: designTokens.color.brand.primary,
    secondary: designTokens.color.brand.secondary,
    
    // Semantic colors
    error: designTokens.color.semantic.error,
    warning: designTokens.color.semantic.warning,
    success: designTokens.color.semantic.success,
    
    // Neutral colors
    background: designTokens.color.neutral.background,
    surface: designTokens.color.neutral.surface,
    'text-primary': designTokens.color.neutral.text.primary,
    'text-secondary': designTokens.color.neutral.text.secondary,
    'text-disabled': designTokens.color.neutral.text.disabled,
    border: designTokens.color.neutral.border,
  },
  
  fontFamily: {
    sans: [designTokens.font.family.base, 'ui-sans-serif', 'system-ui']
  },
  
  fontWeight: designTokens.font.weight,
  
  fontSize: {
    h1: [designTokens.font.size.h1, { lineHeight: designTokens.font.lineHeight.tight }],
    h2: [designTokens.font.size.h2, { lineHeight: designTokens.font.lineHeight.tight }],
    h3: [designTokens.font.size.h3, { lineHeight: designTokens.font.lineHeight.tight }],
    body: [designTokens.font.size.body, { lineHeight: designTokens.font.lineHeight.normal }],
    small: [designTokens.font.size.small, { lineHeight: designTokens.font.lineHeight.normal }],
  },
  
  spacing: designTokens.space,
  
  borderRadius: designTokens.radius,
  
  boxShadow: designTokens.shadow,
  
  letterSpacing: designTokens.font.letterSpacing
};

/**
 * CSS Custom Properties for use in @theme block
 */
export const cssVariables = {
  // Brand Primary
  '--color-primary-50': designTokens.color.brand.primary[50],
  '--color-primary-100': designTokens.color.brand.primary[100],
  '--color-primary-200': designTokens.color.brand.primary[200],
  '--color-primary-300': designTokens.color.brand.primary[300],
  '--color-primary-400': designTokens.color.brand.primary[400],
  '--color-primary-500': designTokens.color.brand.primary[500],
  '--color-primary-600': designTokens.color.brand.primary[600],
  '--color-primary-700': designTokens.color.brand.primary[700],
  '--color-primary-800': designTokens.color.brand.primary[800],
  '--color-primary-900': designTokens.color.brand.primary[900],
  
  // Brand Secondary
  '--color-secondary-50': designTokens.color.brand.secondary[50],
  '--color-secondary-100': designTokens.color.brand.secondary[100],
  '--color-secondary-200': designTokens.color.brand.secondary[200],
  '--color-secondary-300': designTokens.color.brand.secondary[300],
  '--color-secondary-400': designTokens.color.brand.secondary[400],
  '--color-secondary-500': designTokens.color.brand.secondary[500],
  '--color-secondary-600': designTokens.color.brand.secondary[600],
  '--color-secondary-700': designTokens.color.brand.secondary[700],
  '--color-secondary-800': designTokens.color.brand.secondary[800],
  '--color-secondary-900': designTokens.color.brand.secondary[900],
  
  // Semantic Colors
  '--color-error': designTokens.color.semantic.error,
  '--color-warning': designTokens.color.semantic.warning,
  '--color-success': designTokens.color.semantic.success,
  
  // Neutral Colors
  '--color-background': designTokens.color.neutral.background,
  '--color-surface': designTokens.color.neutral.surface,
  '--color-text-primary': designTokens.color.neutral.text.primary,
  '--color-text-secondary': designTokens.color.neutral.text.secondary,
  '--color-text-disabled': designTokens.color.neutral.text.disabled,
  '--color-border': designTokens.color.neutral.border,
  
  // Typography
  '--font-family-base': designTokens.font.family.base,
  '--font-size-h1': designTokens.font.size.h1,
  '--font-size-h2': designTokens.font.size.h2,
  '--font-size-h3': designTokens.font.size.h3,
  '--font-size-body': designTokens.font.size.body,
  '--font-size-small': designTokens.font.size.small,
  
  // Spacing
  '--space-xs': designTokens.space.xs,
  '--space-sm': designTokens.space.sm,
  '--space-md': designTokens.space.md,
  '--space-lg': designTokens.space.lg,
  '--space-xl': designTokens.space.xl,
  
  // Border Radius
  '--radius-sm': designTokens.radius.sm,
  '--radius-md': designTokens.radius.md,
  '--radius-lg': designTokens.radius.lg,
  
  // Shadows
  '--shadow-sm': designTokens.shadow.sm,
  '--shadow-md': designTokens.shadow.md,
  '--shadow-lg': designTokens.shadow.lg,
};