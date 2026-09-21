import React, { useMemo } from 'react';
import { StyleSheet, Text, View, SectionList, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { OPPORTUNITIES } from '@/data/opportunities';
import { evaluateEligibility } from '@/lib/engine';
import { OpportunityCard } from '@/components/OpportunityCard';
import { OpportunityCategory } from '@/lib/types';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

const CATEGORY_TITLES: Record<OpportunityCategory, string> = {
  mass_recruiter: 'Mass Recruiters',
  product: 'Product Based',
  startup: 'Startups',
  government: 'Government / PSUs',
  higher_ed: 'Higher Education'
};

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile } = useStore();

  const sections = useMemo(() => {
    if (!profile) return [];

    // Evaluate all opportunities
    const evaluated = OPPORTUNITIES.map(opp => ({
      opportunity: opp,
      eligibility: evaluateEligibility(opp, profile)
    }));

    // Group by category, but only include those that are eligible or unknown (not explicitly failed)
    // Wait, let's include all so they see what's closed too, or just open doors?
    // "showing exactly which doors remain open." Let's filter out 'not_eligible'.
    // Or actually, maybe show everything but the card shows the status. Let's show only 'eligible' and 'unknown'.
    const visibleOpps = evaluated.filter(item => item.eligibility.status !== 'not_eligible');

    const grouped = visibleOpps.reduce((acc, curr) => {
      const cat = curr.opportunity.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, typeof evaluated>);

    return Object.keys(CATEGORY_TITLES).map(cat => ({
      title: CATEGORY_TITLES[cat as OpportunityCategory],
      data: grouped[cat] || []
    })).filter(section => section.data.length > 0);
  }, [profile]);

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedSectionList
        sections={sections as any}
        keyExtractor={(item: any) => item.opportunity.id}
        contentContainerStyle={{ 
          paddingTop: insets.top + 60, // Space for header
          paddingBottom: insets.bottom + 120, // Space for tabs
          paddingHorizontal: 20 
        }}
        renderItem={({ item, index }: any) => (
          <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
            <OpportunityCard 
              opportunity={item.opportunity} 
              eligibility={item.eligibility} 
            />
          </Animated.View>
        )}
        renderSectionHeader={({ section: { title } }: any) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[typography.h2, { color: colors.foreground }]}>{title}</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
              No open doors found for your current profile. Check if you missed filling out any details in your profile.
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    paddingVertical: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  }
});
