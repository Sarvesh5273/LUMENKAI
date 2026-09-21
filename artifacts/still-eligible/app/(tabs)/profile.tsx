import React from 'react';
import { StyleSheet, Text, View, ScrollView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { Button } from '@/components/Button';
import { useRouter } from 'expo-router';
import { Feather } from '@expo/vector-icons';
import { BRANCH_LABELS, CITIZENSHIP_LABELS, GENDER_LABELS } from '@/lib/types';

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile } = useStore();
  const router = useRouter();

  if (!profile) return null;

  const dataPoints = [
    { label: '10th %', value: profile.tenth_pct !== null ? `${profile.tenth_pct}%` : 'Not set' },
    { label: '12th %', value: profile.twelfth_pct !== null ? `${profile.twelfth_pct}%` : 'Not set' },
    { label: 'CGPA', value: profile.cgpa !== null ? profile.cgpa : 'Not set' },
    { label: 'Active Backlogs', value: profile.active_backlogs !== null ? profile.active_backlogs : 'Not set' },
    { label: 'Gap Years', value: profile.gap_years !== null ? profile.gap_years : 'Not set' },
    { label: 'Branch', value: profile.branch ? BRANCH_LABELS[profile.branch] : 'Not set' },
    { label: 'Graduation Year', value: profile.grad_year !== null ? profile.grad_year : 'Not set' },
    { label: 'Citizenship', value: profile.citizenship ? CITIZENSHIP_LABELS[profile.citizenship] : 'Not set' },
    { label: 'Gender', value: profile.gender ? GENDER_LABELS[profile.gender] : 'Not set' },
    { label: 'Student', value: profile.is_student !== null ? (profile.is_student ? 'Yes' : 'No') : 'Not set' },
    { label: 'Work Experience', value: profile.work_years !== null ? `${profile.work_years} years` : 'Not set' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ 
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 24,
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
