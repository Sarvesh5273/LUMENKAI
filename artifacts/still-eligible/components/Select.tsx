import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import * as Haptics from 'expo-haptics';

interface SelectProps {
  label?: string;
  options: string[];
  value: string | null;
  onChange: (val: string) => void;
  error?: string;
}

export function Select({ label, options, value, onChange, error }: SelectProps) {
  const colors = useColors();

  const handlePress = (val: string) => {
    if (Platform.OS !== 'web') {
      Haptics.selectionAsync();
    }
    onChange(val);
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={[typography.label, { color: colors.foreground, marginBottom: 6 }]}>
          {label}
        </Text>
      )}
      <View style={styles.optionsGrid}>
        {options.map((opt) => {
          const isSelected = value === opt;
          return (
            <TouchableOpacity
              key={opt}
              onPress={() => handlePress(opt)}
              style={[
                styles.option,
                {
                  backgroundColor: isSelected ? colors.primary : colors.background,
                  borderColor: isSelected ? colors.primary : colors.input,
                  borderRadius: colors.radius,
                }
              ]}
            >
              <Text style={[
                typography.bodySmall,
                { color: isSelected ? colors.primaryForeground : colors.foreground }
              ]}>
                {opt}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {error && (
        <Text style={[typography.caption, { color: colors.destructive, marginTop: 4 }]}>
          {error}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
  }
});
