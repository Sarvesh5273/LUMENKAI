import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { Input } from '@/components/Input';
import { Select } from '@/components/Select';
import { Button } from '@/components/Button';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import { 
  BRANCHES, 
  BRANCH_LABELS, 
  CITIZENSHIPS, 
  CITIZENSHIP_LABELS, 
  GENDERS, 
  GENDER_LABELS, 
  Branch, 
  Citizenship, 
  Gender 
} from '@/lib/types';
import { looksLikePercentage, percentageToCgpa, CONVERSION_FORMULAS } from '@/lib/conversions';

export default function OnboardingScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const { updateProfile, profile } = useStore();

  const [form, setForm] = useState({
    tenth_pct: profile?.tenth_pct?.toString() || '',
    twelfth_pct: profile?.twelfth_pct?.toString() || '',
    cgpa: profile?.cgpa?.toString() || '',
    active_backlogs: profile?.active_backlogs?.toString() || '',
    gap_years: profile?.gap_years?.toString() || '',
    branch: profile?.branch || '',
    grad_year: profile?.grad_year?.toString() || '',
    citizenship: profile?.citizenship || '',
    gender: profile?.gender || '',
    is_student: profile?.is_student === true ? 'yes' : profile?.is_student === false ? 'no' : '',
    work_years: profile?.work_years?.toString() || '',
  });

  const [loading, setLoading] = useState(false);

  const cgpaValue = parseFloat(form.cgpa);
  const showCgpaConversion = useMemo(() => looksLikePercentage(cgpaValue), [cgpaValue]);

  const handleSave = async () => {
    // Basic validation
    if (Object.values(form).every(v => v === '' || v === '0' || v === 'yes' || v === 'no')) {
      // Must not be completely empty
      let hasData = false;
      for (const [k, v] of Object.entries(form)) {
        if (k !== 'is_student' && k !== 'work_years' && v !== '') {
          hasData = true;
          break;
        }
      }
      if (!hasData) {
        Alert.alert('Validation Error', 'Please fill in some information to continue.');
        return;
      }
    }

    if (form.tenth_pct && (parseFloat(form.tenth_pct) < 0 || parseFloat(form.tenth_pct) > 100)) {
      Alert.alert('Validation Error', '10th percentage must be between 0 and 100.');
      return;
    }

    if (form.twelfth_pct && (parseFloat(form.twelfth_pct) < 0 || parseFloat(form.twelfth_pct) > 100)) {
      Alert.alert('Validation Error', '12th percentage must be between 0 and 100.');
      return;
    }

    if (form.cgpa && (parseFloat(form.cgpa) < 0 || parseFloat(form.cgpa) > 10)) {
      Alert.alert('Validation Error', 'CGPA must be between 0 and 10.');
      return;
    }

    if (form.active_backlogs && parseInt(form.active_backlogs, 10) < 0) {
      Alert.alert('Validation Error', 'Active backlogs cannot be negative.');
      return;
    }

    if (form.gap_years && parseInt(form.gap_years, 10) < 0) {
      Alert.alert('Validation Error', 'Gap years cannot be negative.');
      return;
    }

    if (form.work_years && parseInt(form.work_years, 10) < 0) {
      Alert.alert('Validation Error', 'Work experience cannot be negative.');
      return;
    }

    try {
      setLoading(true);
      
      const parsedProfile = {
        tenth_pct: form.tenth_pct ? parseFloat(form.tenth_pct) : null,
        twelfth_pct: form.twelfth_pct ? parseFloat(form.twelfth_pct) : null,
        cgpa: form.cgpa ? parseFloat(form.cgpa) : null,
        active_backlogs: form.active_backlogs ? parseInt(form.active_backlogs, 10) : null,
        gap_years: form.gap_years ? parseInt(form.gap_years, 10) : null,
        branch: form.branch ? (form.branch as Branch) : null,
        grad_year: form.grad_year ? parseInt(form.grad_year, 10) : null,
        citizenship: form.citizenship ? (form.citizenship as Citizenship) : null,
        gender: form.gender ? (form.gender as Gender) : null,
        is_student: form.is_student === 'yes' ? true : form.is_student === 'no' ? false : null,
        work_years: form.work_years ? parseInt(form.work_years, 10) : null,
      };

      await updateProfile(parsedProfile);
      
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

  const branchOptions = BRANCHES.map(b => ({ label: BRANCH_LABELS[b], value: b }));
  const citizenshipOptions = CITIZENSHIPS.map(c => ({ label: CITIZENSHIP_LABELS[c], value: c }));
  const genderOptions = GENDERS.map(g => ({ label: GENDER_LABELS[g], value: g }));
  const studentOptions = [{ label: 'Yes', value: 'yes' }, { label: 'No', value: 'no' }];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <KeyboardAwareScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        bottomOffset={20}
      >
        <View style={[styles.header, { paddingTop: insets.top + 40 }]}>
          <Text style={[typography.h1, { color: colors.foreground }]}>Your academic profile</Text>
          <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 8 }]}>
            We use this to run the eligibility rules completely offline. Your data never leaves this device. Every field is optional. A blank field is never assumed to be zero; the rule that needs it just shows as unchecked until you fill it in.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[typography.h3, { color: colors.foreground, marginBottom: 16 }]}>Academics</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="10th percentage"
                placeholder="e.g. 85.5"
                keyboardType="decimal-pad"
                value={form.tenth_pct}
                onChangeText={(t) => setForm(f => ({ ...f, tenth_pct: t }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label="12th / Diploma percentage"
                placeholder="e.g. 80.0"
                keyboardType="decimal-pad"
                value={form.twelfth_pct}
                onChangeText={(t) => setForm(f => ({ ...f, twelfth_pct: t }))}
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
          
          {showCgpaConversion ? (
            <View style={[styles.conversionBox, { backgroundColor: colors.muted, borderRadius: colors.radius }]}>
              <Text style={[typography.bodySmall, { color: colors.foreground, marginBottom: 8 }]}>
                This looks like a percentage. Do you want to convert it to CGPA?
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Button 
                  label={`Use CBSE (${percentageToCgpa(cgpaValue, 'cbse_9_5')})`} 
                  onPress={() => setForm(f => ({ ...f, cgpa: percentageToCgpa(cgpaValue, 'cbse_9_5').toString() }))}
                  size="sm"
                  variant="secondary"
                  style={{ flex: 1 }}
                />
                <Button 
                  label={`Divide by 10 (${percentageToCgpa(cgpaValue, 'direct_10')})`} 
                  onPress={() => setForm(f => ({ ...f, cgpa: percentageToCgpa(cgpaValue, 'direct_10').toString() }))}
                  size="sm"
                  variant="secondary"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ) : (
            <View style={{ backgroundColor: colors.muted, padding: 12, borderRadius: colors.radius, marginBottom: 24 }}>
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>
                Only enter your CGPA on a 10 point scale.
              </Text>
            </View>
          )}

          <Text style={[typography.h3, { color: colors.foreground, marginBottom: 16 }]}>History</Text>
          <View style={styles.row}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="Active backlogs"
                placeholder="0 if none"
                keyboardType="number-pad"
                value={form.active_backlogs}
                onChangeText={(t) => setForm(f => ({ ...f, active_backlogs: t }))}
              />
            </View>
            <View style={{ flex: 1, marginLeft: 8 }}>
              <Input
                label="Gap years"
                placeholder="0 if none"
                keyboardType="number-pad"
                value={form.gap_years}
                onChangeText={(t) => setForm(f => ({ ...f, gap_years: t }))}
              />
            </View>
          </View>

          <Text style={[typography.h3, { color: colors.foreground, marginTop: 16, marginBottom: 16 }]}>Demographics</Text>
          
          <Select
            label="Branch"
            options={branchOptions}
            value={form.branch}
            onChange={(v) => setForm(f => ({ ...f, branch: v }))}
          />

          <View style={{ marginBottom: 16 }}>
            <Input
              label="Graduation year"
              keyboardType="number-pad"
              value={form.grad_year}
              onChangeText={(t) => setForm(f => ({ ...f, grad_year: t }))}
            />
            <View style={{ flexDirection: 'row', gap: 8, marginTop: -8 }}>
              {['2027', '2028', '2029', '2030'].map(yr => (
                <Button 
                  key={yr}
                  label={yr} 
                  onPress={() => setForm(f => ({ ...f, grad_year: yr }))}
                  size="sm"
                  variant={form.grad_year === yr ? 'primary' : 'secondary'}
                  style={{ flex: 1 }}
                />
              ))}
            </View>
          </View>

          <Select
            label="Citizenship"
            options={citizenshipOptions}
            value={form.citizenship}
            onChange={(v) => setForm(f => ({ ...f, citizenship: v }))}
          />

          <Select
            label="Gender (Optional)"
            options={genderOptions}
            value={form.gender}
            onChange={(v) => setForm(f => ({ ...f, gender: v }))}
          />
          <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: -12, marginBottom: 16 }]}>
            Used only to match women-focused programs.
          </Text>

          <Select
            label="Currently enrolled student"
            options={studentOptions}
            value={form.is_student}
            onChange={(v) => setForm(f => ({ ...f, is_student: v }))}
          />

          <Input
            label="Full-time work experience (years)"
            placeholder="0 if none"
            keyboardType="number-pad"
            value={form.work_years}
            onChangeText={(t) => setForm(f => ({ ...f, work_years: t }))}
          />

        </View>
      </KeyboardAwareScrollView>

      <View style={[styles.footer, { backgroundColor: colors.background, paddingBottom: insets.bottom || 20, borderTopColor: colors.border }]}>
        <Button
          label="Save Profile"
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
  conversionBox: {
    padding: 12,
    marginBottom: 24,
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
