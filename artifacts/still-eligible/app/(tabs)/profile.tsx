import React from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile } = useStore();
  const router = useRouter();

  if (!profile) return null;

  const dataPoints = [
    { label: '10th %', value: profile.percent_10th ? `${profile.percent_10th}%` : 'Not set' },
    { label: '12th %', value: profile.percent_12th ? `${profile.percent_12th}%` : 'Not set' },
    { label: 'CGPA', value: profile.cgpa ? profile.cgpa : 'Not set' },
    { label: 'Active Backlogs', value: profile.active_backlogs ?? 0 },
    { label: 'Gap Years', value: profile.gap_years ?? 0 },
    { label: 'Branch', value: profile.branch || 'Not set' },
    { label: 'Graduation Year', value: profile.grad_year || 'Not set' },
    { label: 'Citizenship', value: profile.citizenship || 'Not set' },
    { label: 'Gender', value: profile.gender || 'Not set' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ 
          paddingTop: insets.top + 60,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20 
        }}
      >
        <View style={styles.header}>
          <Text style={[typography.h1, { color: colors.foreground }]}>Profile</Text>
          <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 4 }]}>
            Eligibility engine runs on this data.
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}>
          {dataPoints.map((dp, i) => (
            <View key={dp.label} style={[styles.row, i !== dataPoints.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
              <Text style={[typography.body, { color: colors.mutedForeground }]}>{dp.label}</Text>
              <Text style={[typography.body, { color: colors.cardForeground, fontWeight: '600' }]}>{dp.value}</Text>
            </View>
          ))}
        </View>

        <Button
          label="Edit Profile"
          variant="primary"
          onPress={() => router.push('/onboarding')}
          style={{ marginTop: 24 }}
        />
        
        <View style={styles.disclaimer}>
          <Feather name="shield" size={16} color={colors.mutedForeground} />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginLeft: 8, flex: 1 }]}>
            All data is saved locally on your device. We do not transmit or sell your academic details.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 24,
  },
  card: {
    borderWidth: 1,
    padding: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  disclaimer: {
    flexDirection: 'row',
    marginTop: 32,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(0,0,0,0.03)', // subtle
    padding: 16,
    borderRadius: 8,
  }
});
