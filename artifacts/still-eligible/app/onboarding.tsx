import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const { updateProfile, profile } = useStore();

  const [form, setForm] = useState({
    percent_10th: profile?.percent_10th?.toString() || '',
    percent_12th: profile?.percent_12th?.toString() || '',
    cgpa: profile?.cgpa?.toString() || '',
    active_backlogs: profile?.active_backlogs?.toString() || '0',
    gap_years: profile?.gap_years?.toString() || '0',
    branch: profile?.branch || '',
    grad_year: profile?.grad_year?.toString() || '',
    citizenship: profile?.citizenship || 'Indian',
    gender: profile?.gender || '',
    student_status: profile?.student_status || 'Enrolled',
  });

  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    // Basic validation
    if (!form.branch || !form.grad_year) {
      Alert.alert('Validation Error', 'Please select a Branch and Graduation Year.');
      return;
    }
    
    if (form.percent_10th && (parseFloat(form.percent_10th) < 0 || parseFloat(form.percent_10th) > 100)) {
      Alert.alert('Validation Error', '10th % must be between 0 and 100.');
      return;
    }

    if (form.percent_12th && (parseFloat(form.percent_12th) < 0 || parseFloat(form.percent_12th) > 100)) {
      Alert.alert('Validation Error', '12th % must be between 0 and 100.');
      return;
    }

    if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) {
      Alert.alert('Validation Error', 'CGPA must be between 0 and 10.');
      return;
    }

    try {
      setLoading(true);
      
      const parsedProfile = {
        percent_10th: form.percent_10th ? parseFloat(form.percent_10th) : null,
        percent_12th: form.percent_12th ? parseFloat(form.percent_12th) : null,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
        active_backlogs: form.active_backlogs ? parseInt(form.active_backlogs, 10) : 0,
        gap_years: form.gap_years ? parseInt(form.gap_years, 10) : 0,
        branch: form.branch || null,
        grad_year: form.grad_year ? parseInt(form.grad_year, 10) : null,
        citizenship: form.citizenship || null,
        gender: form.gender || null,
        student_status: form.student_status || null,
      };

      await updateProfile(parsedProfile);
      
      // If onboarding is modal, can dismiss. If first time, replace to tabs.
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace('/(tabs)');
      }
    } catch (e) {
      Alert.alert('Error', 'Could not save profile.');
    } finally {
      setLoading(false);
    }
  };

  const BRANCHES = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil', 'Other'];
  const YEARS = ['2023', '2024', '2025', '2026', '2027'];
  const GENDERS = ['Male', 'Female', 'Other'];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        bottomOffset={20}
      >
        <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
          <Text style={[typography.h1, { color: colors.foreground }]}>Your academic profile</Text>
          <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            We use this to run the eligibility rules completely offline. Your data never leaves this device.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[typography.h3, { color: colors.foreground, marginBottom: 16 }]}>Academics</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="10th %"
                placeholder="e.g. 85.5"
                keyboardType="decimal-pad"
                value={form.percent_10th}
                onChangeText={(t) => setForm(f => ({ ...f, percent_10th: t }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label="12th / Diploma %"
                placeholder="e.g. 80.0"
                keyboardType="decimal-pad"
                value={form.percent_12th}
                onChangeText={(t) => setForm(f => ({ ...f, percent_12th: t }))}
              />
            </View>
          </View>
          
          <Input
            label="Current CGPA (out of 10)"
            placeholder="e.g. 7.5"
            keyboardType="decimal-pad"
            value={form.cgpa}
            onChangeText={(t) => setForm(f => ({ ...f, cgpa: t }))}
          />
          <View style={{ backgroundColor: colors.muted, padding: 12, borderRadius: colors.radius, marginBottom: 24 }}>
            <Text style={[typography.caption, { color: colors.mutedForeground }]}>
              Note: Do not multiply CGPA by 10 unless explicitly told. Keep it out of 10.
            </Text>
          </View>

          <Text style={[typography.h3, { color: colors.foreground, marginBottom: 16 }]}>History</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="Active Backlogs"
                keyboardType="number-pad"
                value={form.active_backlogs}
                onChangeText={(t) => setForm(f => ({ ...f, active_backlogs: t }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label="Gap Years"
                keyboardType="number-pad"
                value={form.gap_years}
                onChangeText={(t) => setForm(f => ({ ...f, gap_years: t }))}
              />
            </View>
          </View>

          <Text style={[typography.h3, { color: colors.foreground, marginTop: 16, marginBottom: 16 }]}>Demographics</Text>
          
          <Select
            label="Branch"
            options={BRANCHES}
            value={form.branch}
            onChange={(v) => setForm(f => ({ ...f, branch: v }))}
          />

          <Select
            label="Graduation Year"
            options={YEARS}
            value={form.grad_year}
            onChange={(v) => setForm(f => ({ ...f, grad_year: v }))}
          />

          <Select
            label="Gender (Optional for diversity drives)"
            options={GENDERS}
            value={form.gender}
            onChange={(v) => setForm(f => ({ ...f, gender: v }))}
          />

          <Select
            label="Student Status"
            options={['Enrolled', 'Graduated']}
            value={form.student_status}
            onChange={(v) => setForm(f => ({ ...f, student_status: v }))}
          />
        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: insets.bottom || 20, borderTopColor: colors.border }]}>
        <Button
          label="Save & See Doors"
          onPress={handleSave}
          loading={loading}
          size="lg"
          style={{ width: '100%' }}
          testID="onboarding-save-button"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  form: {
    paddingHorizontal: 24,
  },
  row: {
    flexDirection: 'row',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
  }
});
