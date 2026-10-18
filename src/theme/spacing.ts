/**
 * Amplifund Spacing, Margins & Base Grid (8pt system)
 */

export const spacing = {
  xs: 4,     // space-xs
  sm: 8,     // space-sm
  md: 16,    // space-md
  lg: 24,    // space-lg
  xl: 32,    // space-xl
  xxl: 40,
  xxxl: 48,

  // Editorial margins
  marginMobile: 16,
  margin: 20,
  marginDesktop: 40,
  gutter: 16,
  gutterSm: 12,
  gutterLg: 24,

  // Touch Ergonomics
  minTouchTarget: 44,
  buttonHeight: 48,
  inputHeight: 48,
  bottomBarHeight: 64,
} as const;

export const borderRadius = {
  none: 0,
  sm: 4,
  md: 8,
  input: 10,
  button: 12,
  lg: 16,
  card: 18,
  xl: 20,
  sheet: 20,
  full: 9999,
} as const;

export const shadows = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  // Layer 1 (Card & Section): 0 1px 3px rgba(32, 37, 31, 0.04), 0 4px 12px rgba(32, 37, 31, 0.03)
  layer1: {
    shadowColor: '#20251F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  // Layer 2 (Floating Controls & Navigation): 0 -2px 10px rgba(32, 37, 31, 0.05)
  layer2: {
    shadowColor: '#20251F',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 4,
  },
  // Layer 3 (Modals & elevated FAB): 0 4px 16px rgba(32, 37, 31, 0.12)
  layer3: {
    shadowColor: '#20251F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
} as const;
