import React from 'react';
import { StyleSheet, Text, TouchableOpacity, TouchableOpacityProps, ActivityIndicator } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

interface ButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export function Button({ 
  label, 
  variant = 'primary', 
  size = 'md', 
  loading = false, 
  style, 
  disabled, 
  onPress,
  ...props 
}: ButtonProps) {
  const colors = useColors();

  const handlePress = (e: any) => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.(e);
  };

  const getBackgroundColor = () => {
    if (disabled) return colors.muted;
    switch (variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'outline': return 'transparent';
      case 'ghost': return 'transparent';
    }
  };

  const getBorderColor = () => {
    if (disabled) return colors.muted;
    if (variant === 'outline') return colors.border;
    return 'transparent';
  };

  const getTextColor = () => {
    if (disabled) return colors.mutedForeground;
    switch (variant) {
      case 'primary': return colors.primaryForeground;
      case 'secondary': return colors.secondaryForeground;
      case 'outline': return colors.foreground;
      case 'ghost': return colors.foreground;
    }
  };

  const getHeight = () => {
    switch (size) {
      case 'sm': return 36;
      case 'md': return 48;
      case 'lg': return 56;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled || loading}
      style={[
        styles.button,
        {
          backgroundColor: getBackgroundColor(),
          borderColor: getBorderColor(),
          borderWidth: variant === 'outline' ? 1 : 0,
          height: getHeight(),
          borderRadius: colors.radius,
        },
        style
      ]}
      activeOpacity={0.8}
      accessibilityRole="button"
      accessibilityLabel={label}
      testID={props.testID || 'button'}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[
          typography.label,
          { color: getTextColor() },
          size === 'lg' && { fontSize: 16 }
        ]}>
          {label}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  }
});
