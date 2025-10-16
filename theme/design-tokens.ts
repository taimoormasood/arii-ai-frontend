/**
 * Design Tokens for Rental Guru
 * Based on the design system provided by the design team
 */

export const designTokens = {
  // Brand Colors
  color: {
    brand: {
      primary: {
        50: "#F5F3FF",
        100: "#EDE9FE", 
        200: "#DDD6FE",
        300: "#C4B5FD",
        400: "#A78BFA",
        500: "#8B5CF6", // Main primary
        600: "#7C3AED",
        700: "#6D28D9",
        800: "#5B21B6",
        900: "#4C1D95"
      },
      secondary: {
        50: "#ECFEFF",
        100: "#CFFAFE",
        200: "#A5F3FC", 
        300: "#67E8F9",
        400: "#22D3EE",
        500: "#06B6D4", // Main secondary
        600: "#0891B2",
        700: "#0E7490",
        800: "#155E75",
        900: "#164E63"
      }
    },
    text: {
        50: "#F5F3FF",
        100: "#EDE9FE", 
        200: "#DDD6FE",
        300: "#C4B5FD",
        400: "#A78BFA",
        500: "#8B5CF6", // Main primary
        600: "#7C3AED",
        700: "#6D28D9",
        800: "#5B21B6",
        900: "#4C1D95"
    },
    semantic: {
      error: "#F04438",
      warning: "#F79009", 
      success: "#17B26A"
    },
    neutral: {
      background: "#FFFFFF",
      surface: "#F9FAFB",
      text: {
        primary: "#0F172A",
        secondary: "#475569",
        disabled: "#94A3B8"
      },
      border: "#E2E8F0"
    }
  },

  // Typography
  font: {
    family: {
      base: "'Urbanist', sans-serif" // Using Urbanist instead of Poppins as requested
    },
    weight: {
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },
    size: {
      h1: "40px",
      h2: "32px", 
      h3: "24px",
      body: "16px",
      small: "12px"
    },
    lineHeight: {
      tight: "1.2",
      normal: "1.5", 
      relaxed: "1.75"
    },
    letterSpacing: {
      normal: "0em",
      wide: "0.02em"
    }
  },

  // Spacing
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px", 
    lg: "24px",
    xl: "32px"
  },

  // Border Radius
  radius: {
    sm: "4px",
    md: "8px",
    lg: "16px"
  },

  // Shadows
  shadow: {
    sm: "0 1px 2px rgba(0, 0, 0, 0.05)",
    md: "0 4px 6px rgba(0, 0, 0, 0.1)",
    lg: "0 10px 15px rgba(0, 0, 0, 0.15)"
  }
} as const;

export type DesignTokens = typeof designTokens;