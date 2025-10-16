/**
 * Theme System Entry Point
 * Centralizes all theme-related exports for easy importing
 */

// Design tokens and configuration
export { designTokens } from './design-tokens';
export type { DesignTokens } from './design-tokens';
export { themeConfig, cssVariables } from './config';

// Theme utilities and classes
export { theme, themeClasses, breakpoints, animations } from './theme';

// React hooks
export { useTheme, useThemeClasses } from './use-theme';

// Re-export everything for convenience
export * from './design-tokens';
export * from './config';
export * from './theme';
export * from './use-theme';