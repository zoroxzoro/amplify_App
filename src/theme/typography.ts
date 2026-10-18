import { TextStyle } from 'react-native';

/**
 * Amplifund Typography Tokens
 * Headline: Newsreader (authoritative transitional serif)
 * Operational UI: Plus Jakarta Sans (high-clarity modern sans)
 */

export const typography = {
  displayLg: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 34,
    lineHeight: 40,
    letterSpacing: -0.68,
    fontWeight: '500' as const,
  },
  headlineLg: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 26,
    lineHeight: 32,
    letterSpacing: -0.39,
    fontWeight: '500' as const,
  },
  headlineMd: {
    fontFamily: 'Newsreader_500Medium',
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: -0.21,
    fontWeight: '500' as const,
  },
  headlineSm: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 17,
    lineHeight: 24,
    letterSpacing: -0.17,
    fontWeight: '600' as const,
  },
  bodyLg: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 16,
    lineHeight: 26,
    letterSpacing: 0,
    fontWeight: '400' as const,
  },
  bodyMd: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 14,
    lineHeight: 22,
    letterSpacing: 0.07,
    fontWeight: '400' as const,
  },
  bodySm: {
    fontFamily: 'PlusJakartaSans_400Regular',
    fontSize: 13,
    lineHeight: 18,
    letterSpacing: 0.13,
    fontWeight: '400' as const,
  },
  labelMd: {
    fontFamily: 'PlusJakartaSans_600SemiBold',
    fontSize: 12,
    lineHeight: 16,
    letterSpacing: 0.24,
    fontWeight: '600' as const,
  },
  labelMicro: {
    fontFamily: 'PlusJakartaSans_700Bold',
    fontSize: 10.5,
    lineHeight: 14,
    letterSpacing: 0.84, // 0.08em generous letter-spacing for micro-labels
    fontWeight: '700' as const,
    textTransform: 'uppercase' as const,
  },
} as const satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
