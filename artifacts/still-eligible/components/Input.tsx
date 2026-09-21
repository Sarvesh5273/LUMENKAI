import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helper?: string;
}

export function Input({ label, error, helper, style, ...props }: InputProps) {
  const colors = useColors();

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[typography.label, { color: colors.foreground, marginBottom: 6 }]}>
          {label}
        </Text>
      )}
      <TextInput
        testID={props.testID || `input-${label?.toLowerCase().replace(/\s+/g, '-')}`}
        style={[
          styles.input,
          typography.body,
          {
            backgroundColor: colors.background,
            borderColor: error ? colors.destructive : colors.input,
            color: colors.foreground,
            borderRadius: colors.radius,
          },
          style
        ]}
        placeholderTextColor={colors.mutedForeground}
        {...props}
      />
      {error ? (
        <Text style={[typography.caption, { color: colors.destructive, marginTop: 4 }]}>
          {error}
        </Text>
      ) : helper ? (
        <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 4 }]}>
          {helper}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    paddingHorizontal: 12,
  }
});
