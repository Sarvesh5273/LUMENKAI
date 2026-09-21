import React from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { CATEGORY_LABELS, OpportunityCategory } from '@/lib/types';

/**
 * A fixed five-step route for a student with weak marks and no network.
 * Static on purpose: it is advice, not data, and it does not change with
 * the dataset. Each step links to the matching category on the home feed.
 */
type Step = {
  title: string;
  why: string;
  what: string;
  category: OpportunityCategory;
};

const STEPS: Step[] = [
  {
    title: 'Enter one hackathon',
    why: 'Most hackathons ask for a team and a weekend, not marks or a CGPA. You leave with a project you can show, whether or not you win.',
    what: 'Pick one from the list, form a team of three or four, and ship something that runs. Finishing matters more than winning.',
    category: 'hackathons_fellowships',
  },
  {
    title: 'Get one open source pull request merged',
    why: 'A merged pull request is proof of work that a recruiter can click on. It counts for more than a certificate and costs nothing.',
    what: 'Start with a beginner-friendly program. Fix a documentation typo first, then a small bug. One merged change is the goal.',
    category: 'open_source',
  },
  {
    title: 'Apply to a paid remote mentorship',
    why: 'Programs like these pay you to learn under a mentor. Selection runs on your proposal and contributions; the ones listed here publish no marks cutoff.',
    what: 'Use the pull request from step two as your application. Apply to more than one; the acceptance rates are low for everyone.',
    category: 'open_source',
  },
  {
    title: 'Aim for a funded internship or a stipend program',
    why: 'Once you have a merged contribution and a mentorship on your resume, stipend programs and funded internships open up.',
    what: 'Apply to the ones with no marks cutoff first. Track the deadlines here so you never miss a window by a week.',
    category: 'funded_internships',
  },
  {
    title: 'Apply to product companies directly',
    why: 'Off-campus drives at product companies run on a coding test and interviews, not on a placement cell shortlist. Each card shows the cutoffs the company publishes.',
    what: 'Only apply where you clear the published criteria. This app tells you which ones those are, so you spend time on real doors.',
    category: 'company_drives',
  },
];

export default function PathFromZeroScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();

  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const openCategory = (category: OpportunityCategory) => {
    router.navigate({ pathname: '/(tabs)', params: { category } });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]} testID="path-from-zero">
        <Text style={[typography.h1, { color: colors.foreground }]}>Path from zero</Text>
        <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 8 }]}>
          Weak marks, backlogs, a college nobody has heard of. None of that blocks the first three steps below. Each step earns you the next one.
        </Text>

        {STEPS.map((step, index) => (
          <View
            key={step.title}
            style={[styles.step, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
            testID={`path-step-${index + 1}`}
          >
            <View style={styles.stepHeader}>
              <View style={[styles.stepNumber, { backgroundColor: colors.primary }]}>
                <Text style={[typography.label, { color: colors.primaryForeground }]}>{index + 1}</Text>
              </View>
              <Text style={[typography.h3, { color: colors.cardForeground, flex: 1 }]}>{step.title}</Text>
            </View>
            <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 12 }]}>Why this step</Text>
            <Text style={[typography.body, { color: colors.cardForeground, marginTop: 2 }]}>{step.why}</Text>
            <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 10 }]}>What to do</Text>
            <Text style={[typography.body, { color: colors.cardForeground, marginTop: 2 }]}>{step.what}</Text>
            <TouchableOpacity
              onPress={() => openCategory(step.category)}
              style={styles.stepLink}
              accessibilityRole="button"
              accessibilityLabel={`See ${CATEGORY_LABELS[step.category]} on the home feed`}
              testID={`path-step-${index + 1}-link`}
            >
              <Text style={[typography.label, { color: colors.primary }]}>See {CATEGORY_LABELS[step.category].toLowerCase()}</Text>
              <Feather name="arrow-right" size={16} color={colors.primary} style={{ marginLeft: 4 }} />
            </TouchableOpacity>
          </View>
        ))}

        <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 8 }]}>
          Steps one to three rarely carry a marks cutoff, and every card tells you when one applies. If step four or five is closed to you today, the first three still move you forward, and your CGPA and backlogs are the only numbers that can still change.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    alignSelf: 'flex-start',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  step: {
    borderWidth: 1,
    padding: 16,
    marginTop: 16,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  stepNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLink: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    marginTop: 14,
    paddingVertical: 4,
  },
});
