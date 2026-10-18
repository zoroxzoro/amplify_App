/**
 * Amplifund Visual Design System - Color Tokens
 * Source of truth: DESIGN.md & Stitch Design Exports
 */

export const colors = {
  // Canvas & Surfaces
  canvas: '#F8F8F3', // Warm ivory paper ground
  surface: '#f6fbf1',
  surfaceDim: '#d7dcd2',
  surfaceBright: '#f6fbf1',
  surfaceContainerLowest: '#ffffff', // Layer 1 Cards & Dialogs
  surfaceContainerLow: '#f1f5eb',
  surfaceContainer: '#ebefe6',
  surfaceContainerHigh: '#e5eae0',
  surfaceContainerHighest: '#dfe4da',
  surfaceVariant: '#dfe4da',
  surfaceTint: '#326850',

  // Ink & Typography
  onSurface: '#181d17', // Primary charcoal text
  onSurfaceVariant: '#404943', // Secondary text
  inverseSurface: '#2d322b',
  inverseOnSurface: '#eef2e8',
  textPrimary: '#20251F',
  textSecondary: '#565E54',
  textMuted: '#879284',

  // Borders & Outlines
  outline: '#707973',
  outlineVariant: '#c0c9c1',
  containmentBorder: '#E2E7E0', // Standard 1px card/module perimeter stroke
  inputBorder: '#CCD4CB',

  // Primary Brand (Deep Archival Forest Green)
  primary: '#05432d',
  primaryInk: '#245B43', // Button & active marker forest green
  primaryContainer: '#245b43',
  onPrimary: '#ffffff',
  onPrimaryContainer: '#98d1b2',
  inversePrimary: '#9ad3b4',
  primaryFixed: '#b5efd0',
  primaryFixedDim: '#9ad3b4',
  onPrimaryFixed: '#002114',
  onPrimaryFixedVariant: '#175039',

  // Secondary Accent (Muted Sage & Neutral Stone)
  secondary: '#59605a',
  secondaryContainer: '#dde4dc',
  secondaryContainerSoft: '#E8EFE7', // Muted sage for resting badge backgrounds
  onSecondary: '#ffffff',
  onSecondaryContainer: '#5f6660',
  secondaryFixed: '#dde4dc',
  secondaryFixedDim: '#c1c8c1',
  onSecondaryFixed: '#161d18',
  onSecondaryFixedVariant: '#414843',

  // Tertiary (Warm Amber / Civic Alert)
  tertiary: '#5b2f00',
  tertiaryContainer: '#7c4300',
  onTertiary: '#ffffff',
  onTertiaryContainer: '#ffb575',
  tertiaryFixed: '#ffdcc2',
  tertiaryFixedDim: '#ffb77a',
  onTertiaryFixed: '#2e1500',
  onTertiaryFixedVariant: '#6d3a00',

  // Semantic Feedback & Milestones
  amplified: '#2F855A', // Active broadcast / goal reached
  amplifiedBg: '#EBF5F0',
  pending: '#D9822B', // In review / pending verification
  pendingBg: '#FDF3E7',
  restricted: '#C84C40', // Policy flag / validation error
  restrictedBg: '#FDF0EE',
  error: '#ba1a1a',
  errorContainer: '#ffdad6',
  onError: '#ffffff',
  onErrorContainer: '#93000a',

  // Scrim & Shadows
  scrim: 'rgba(32, 37, 31, 0.40)',
  shadowAmbient: 'rgba(32, 37, 31, 0.04)',
  shadowKey: 'rgba(32, 37, 31, 0.08)',
} as const;

export type ColorToken = keyof typeof colors;
