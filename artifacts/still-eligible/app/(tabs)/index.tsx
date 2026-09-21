import React, { useMemo } from 'react';
import { StyleSheet, Text, View, SectionList, ActivityIndicator, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { OPPORTUNITIES } from '@/data';
import { evaluateAll, PROFILE_FIELD_LABELS, summarizeStatus } from '@/lib/engine';
import { OpportunityCard } from '@/components/OpportunityCard';
import { CATEGORIES, CATEGORY_LABELS } from '@/lib/types';
import { deadlineSortValue } from '@/lib/deadlines';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile } = useStore();

  const { sections, totalDoors, totalEligible, missingFields } = useMemo(() => {
    if (!profile) return { sections: [], totalDoors: 0, totalEligible: 0, missingFields: [] };

    const evaluated = evaluateAll(OPPORTUNITIES, profile);
    const visibleOpps = evaluated.filter(item => item.eligibility.status !== 'not_eligible');

    const grouped = visibleOpps.reduce((acc, curr) => {
      const cat = curr.opportunity.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, typeof evaluated>);

    let doorsCount = 0;
    let eligibleCount = 0;
    const allMissing = new Set<string>();

    const builtSections = CATEGORIES.map(cat => {
      const data = grouped[cat] || [];
      const sectionEligibleCount = data.filter(d => summarizeStatus(d.opportunity, d.eligibility).tone === 'open').length;
      doorsCount += data.length;
      eligibleCount += sectionEligibleCount;
      
      data.forEach(d => {
        d.eligibility.missingFields.forEach(mf => { if (mf !== 'gender') allMissing.add(mf); });
      });

      return {
        title: CATEGORY_LABELS[cat],
        data: data.sort((a, b) => deadlineSortValue(a.opportunity.deadline) - deadlineSortValue(b.opportunity.deadline)),
        eligibleCount: sectionEligibleCount,
        totalCount: data.length
      };
    }).filter(section => section.data.length > 0);

    return { 
      sections: builtSections, 
      totalDoors: doorsCount,
      totalEligible: eligibleCount,
      missingFields: Array.from(allMissing)
    };
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
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20 
        }}
        ListHeaderComponent={(
          <View style={styles.listHeader}>
            <Text style={[typography.h1, { color: colors.foreground }]}>Doors open</Text>
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 4 }]}>
              {totalEligible} you qualify for, {totalDoors - totalEligible} still to check.
            </Text>
            
            {missingFields.length > 0 && (
              <View style={[styles.banner, { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderRadius: colors.radius }]}>
                <Feather name="info" size={16} color={colors.accentForeground} style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[typography.bodySmall, { color: colors.accentForeground }]}>
                    Fill in your {missingFields.map(f => PROFILE_FIELD_LABELS[f as keyof typeof PROFILE_FIELD_LABELS]).join(', ')} to settle the doors marked check.
                  </Text>
                  <Link href="/(tabs)/profile" style={{ marginTop: 4 }}>
                    <Text style={[typography.bodySmall, { color: colors.primary, fontWeight: '600' }]}>Complete your profile</Text>
                  </Link>
                </View>
              </View>
            )}
          </View>
        )}
        renderItem={({ item, index }: any) => (
          <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
            <OpportunityCard 
              opportunity={item.opportunity} 
              eligibility={item.eligibility} 
            />
          </Animated.View>
        )}
        renderSectionHeader={({ section: { title, eligibleCount, totalCount } }: any) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[typography.h2, { color: colors.foreground }]}>{title}</Text>
            <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 2 }]}>
              {eligibleCount} of {totalCount} confirmed
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
              We did not find any opportunities matching your profile at the moment.
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
  listHeader: {
    marginBottom: 24,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    marginTop: 16,
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
