// ──────────────────────────────────────────────────────────────────────────────
// Design System – AI-Insta Mobile
// Premium dark-mode first, Instagram-inspired aesthetic
// ──────────────────────────────────────────────────────────────────────────────

export const Colors = {
  // Backgrounds
  background: '#0A0A0F',
  surface: '#12121A',
  surfaceElevated: '#1A1A26',
  surfaceBorder: '#2A2A3A',

  // Brand gradient stops
  brandPurple: '#8B5CF6',
  brandPink: '#EC4899',
  brandBlue: '#3B82F6',

  // Text
  textPrimary: '#F0F0FF',
  textSecondary: '#8888AA',
  textMuted: '#55556A',

  // Semantic
  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',

  // Status badge colors
  status: {
    DRAFT: '#55556A',
    RENDERING: '#F59E0B',
    PENDING_REVIEW: '#8B5CF6',
    APPROVED: '#22C55E',
    PUBLISHED: '#3B82F6',
    REJECTED: '#EF4444',
    FAILED: '#EF4444',
  },

  // Tab bar
  tabActive: '#8B5CF6',
  tabInactive: '#55556A',

  // Overlay
  overlay: 'rgba(0,0,0,0.75)',
  overlayLight: 'rgba(0,0,0,0.4)',
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const Radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 100,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 22,
  xxl: 28,
  display: 34,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Gradient presets (for use with expo-linear-gradient if installed, or as ref)
export const Gradients = {
  brand: ['#8B5CF6', '#EC4899'],
  brandDark: ['#6D28D9', '#DB2777'],
  surface: ['#12121A', '#0A0A0F'],
  success: ['#16A34A', '#22C55E'],
  danger: ['#DC2626', '#EF4444'],
} as const;
