import { Platform, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';

export const typography = StyleSheet.create({
  h1: {
    fontFamily: 'Inter_700Bold',
    fontSize: 32,
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  h2: {
    fontFamily: 'Inter_700Bold',
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.5,
  },
  h3: {
    fontFamily: 'Inter_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLarge: {
    fontFamily: 'Inter_400Regular',
    fontSize: 18,
    lineHeight: 28,
  },
  body: {
    fontFamily: 'Inter_400Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodySmall: {
    fontFamily: 'Inter_400Regular',
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontFamily: 'Inter_500Medium',
    fontSize: 14,
    lineHeight: 20,
  },
  caption: {
    fontFamily: 'Inter_500Medium',
    fontSize: 12,
    lineHeight: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  }
});

export const layout = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 20,
  },
  card: {
    padding: 16,
    borderRadius: 16, // Softer than standard 8
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
