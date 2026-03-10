// constants/styles.ts
import { StyleSheet } from 'react-native';

export const COLORS = {
  primary: '#4F46E5',       // indigo
  primaryDark: '#3730A3',
  error: '#DC2626',
  success: '#16A34A',
  background: '#F9FAFB',
  white: '#FFFFFF',
  border: '#D1D5DB',
  borderFocus: '#4F46E5',
  text: '#111827',
  textMuted: '#6B7280',
  inputBg: '#FFFFFF',
};

export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: COLORS.background,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMuted,
    marginBottom: 28,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  errorText: {
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 2,
  },
});
