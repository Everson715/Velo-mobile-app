export const colors = {
  background: '#0a0a0c',
  card: '#16161a',
  primary: '#00e5ff',
  primaryDark: '#00b4cc',
  secondary: '#7c3aed',
  text: '#ffffff',
  textMuted: '#94a3b8',
  border: '#27272a',
  error: '#ef4444',
  success: '#10b981',
};

export const spacing = {
  xs: 4,
  s: 8,
  m: 16,
  l: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  s: 8,
  m: 12,
  l: 16,
  xl: 24,
  round: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const, color: colors.text },
  h2: { fontSize: 24, fontWeight: '700' as const, color: colors.text },
  h3: { fontSize: 20, fontWeight: '600' as const, color: colors.text },
  body: { fontSize: 16, fontWeight: '400' as const, color: colors.text },
  bodyMuted: { fontSize: 16, fontWeight: '400' as const, color: colors.textMuted },
  caption: { fontSize: 14, fontWeight: '400' as const, color: colors.textMuted },
};
