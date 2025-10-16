'use client';

import { useCallback, useMemo } from 'react';
import { designTokens } from './design-tokens';
import { theme, themeClasses } from './theme';

/**
 * Custom hook for accessing theme utilities and tokens
 */
export function useTheme() {
  // Memoized theme access functions
  const getColor = useCallback((
    category: 'primary' | 'secondary' | 'error' | 'warning' | 'success',
    shade?: number
  ) => {
    switch (category) {
      case 'primary':
        return shade ? designTokens.color.brand.primary[shade as keyof typeof designTokens.color.brand.primary] : designTokens.color.brand.primary[500];
      case 'secondary':
        return shade ? designTokens.color.brand.secondary[shade as keyof typeof designTokens.color.brand.secondary] : designTokens.color.brand.secondary[500];
      case 'error':
        return designTokens.color.semantic.error;
      case 'warning':
        return designTokens.color.semantic.warning;
      case 'success':
        return designTokens.color.semantic.success;
      default:
        return designTokens.color.brand.primary[500];
    }
  }, []);

  const getFontSize = useCallback((size: keyof typeof designTokens.font.size) => {
    return designTokens.font.size[size];
  }, []);

  const getSpacing = useCallback((space: keyof typeof designTokens.space) => {
    return designTokens.space[space];
  }, []);

  const getRadius = useCallback((radius: keyof typeof designTokens.radius) => {
    return designTokens.radius[radius];
  }, []);

  const getShadow = useCallback((shadow: keyof typeof designTokens.shadow) => {
    return designTokens.shadow[shadow];
  }, []);

  // Memoized theme object
  const memoizedTheme = useMemo(() => theme, []);
  const memoizedClasses = useMemo(() => themeClasses, []);

  return {
    theme: memoizedTheme,
    classes: memoizedClasses,
    tokens: designTokens,
    
    // Utility functions
    getColor,
    getFontSize,
    getSpacing,
    getRadius,
    getShadow,
  };
}

/**
 * Hook for dynamic class name generation based on theme
 */
export function useThemeClasses() {
  const { classes } = useTheme();
  
  const buildClassName = useCallback((...classNames: (string | undefined | false)[]) => {
    return classNames.filter(Boolean).join(' ');
  }, []);

  const getButtonClasses = useCallback((
    variant: keyof typeof classes.button,
    size: 'sm' | 'md' | 'lg' = 'md',
    disabled: boolean = false
  ) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const sizeClasses = {
      sm: 'h-9 px-3 text-small',
      md: 'h-10 py-2 px-4 text-body',
      lg: 'h-11 px-6 text-body',
    };

    return buildClassName(
      baseClasses,
      sizeClasses[size],
      classes.button[variant],
      disabled && 'opacity-50 cursor-not-allowed'
    );
  }, [classes.button, buildClassName]);

  const getTextClasses = useCallback((
    variant: keyof typeof classes.text,
    className?: string
  ) => {
    return buildClassName(classes.text[variant], className);
  }, [classes.text, buildClassName]);

  const getHeadingClasses = useCallback((
    level: keyof typeof classes.heading,
    className?: string
  ) => {
    return buildClassName(classes.heading[level], className);
  }, [classes.heading, buildClassName]);

  return {
    buildClassName,
    getButtonClasses,
    getTextClasses,
    getHeadingClasses,
    classes,
  };
}