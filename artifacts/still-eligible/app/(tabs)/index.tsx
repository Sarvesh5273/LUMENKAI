import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, Text, View, SectionList, ActivityIndicator, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { evaluateAll, PROFILE_FIELD_LABELS, summarizeStatus } from '@/lib/engine';
import { OpportunityCard } from '@/components/OpportunityCard';
import { CATEGORIES, CATEGORY_INTROS, CATEGORY_LABELS, OpportunityCategory } from '@/lib/types';
import { deadlineSortValue, formatDate } from '@/lib/deadlines';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

function isCategory(value: unknown): value is OpportunityCategory {
  return typeof value === 'string' && (CATEGORIES as readonly string[]).includes(value);
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const params = useLocalSearchParams<{ category?: string }>();
  const { profile, records, dataUpdatedAt, isRefreshingData, refreshDataset, isNew } = useStore();

  const [remoteOnly, setRemoteOnly] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<OpportunityCategory | null>(null);

  // The "Path from zero" screen links here with ?category=. Re-read it each
  // time the param changes so following a second link switches the filter.
  useEffect(() => {
    setCategoryFilter(isCategory(params.category) ? params.category : null);
  }, [params.category]);

  const clearCategory = () => {
    setCategoryFilter(null);
    router.setParams({ category: '' });
  };

  const { sections, totalDoors, totalEligible, missingFields } = useMemo(() => {
    if (!profile) return { sections: [], totalDoors: 0, totalEligible: 0, missingFields: [] };

    const evaluated = evaluateAll(records, profile);
    const visibleOpps = evaluated.filter((item) => {
      if (item.eligibility.status === 'not_eligible') return false;
      if (remoteOnly && item.opportunity.location.mode !== 'remote') return false;
      if (categoryFilter && item.opportunity.category !== categoryFilter) return false;
      return true;
    });

    const grouped = visibleOpps.reduce((acc, curr) => {
      const cat = curr.opportunity.category;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(curr);
      return acc;
    }, {} as Record<string, typeof evaluated>);

    let doorsCount = 0;
    let eligibleCount = 0;
    const allMissing = new Set<string>();

    const builtSections = CATEGORIES.map((cat) => {
      const data = grouped[cat] || [];
      const sectionEligibleCount = data.filter((d) => summarizeStatus(d.opportunity, d.eligibility).tone === 'open').length;
      doorsCount += data.length;
      eligibleCount += sectionEligibleCount;

      data.forEach((d) => {
        d.eligibility.missingFields.forEach((mf) => { if (mf !== 'gender') allMissing.add(mf); });
      });

      return {
        category: cat,
        title: CATEGORY_LABELS[cat],
        intro: CATEGORY_INTROS[cat],
        data: data.sort((a, b) => deadlineSortValue(a.opportunity.deadline) - deadlineSortValue(b.opportunity.deadline)),
        eligibleCount: sectionEligibleCount,
        totalCount: data.length,
      };
    }).filter((section) => section.data.length > 0);

    return {
      sections: builtSections,
      totalDoors: doorsCount,
      totalEligible: eligibleCount,
      missingFields: Array.from(allMissing),
    };
  }, [profile, records, remoteOnly, categoryFilter]);

  if (!profile) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const updatedDate = new Date(dataUpdatedAt);
  const updatedText = Number.isNaN(updatedDate.getTime()) ? 'unknown date' : formatDate(updatedDate);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <AnimatedSectionList
        sections={sections as any}
        keyExtractor={(item: any) => item.opportunity.id}
        stickySectionHeadersEnabled={false}
        refreshControl={
          <RefreshControl refreshing={isRefreshingData} onRefresh={() => { void refreshDataset(); }} tintColor={colors.primary} />
        }
        contentContainerStyle={{
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        ListHeaderComponent={(
          <View style={styles.listHeader}>
            <Text style={[typography.h1, { color: colors.foreground }]}>Doors open</Text>
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 4 }]}>
              {totalEligible} you qualify for, {totalDoors - totalEligible} still to check.
            </Text>
            <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 8 }]} testID="data-updated">
              Data updated {updatedText}
            </Text>

            {missingFields.length > 0 && (
              <View style={[styles.banner, { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderRadius: colors.radius }]}>
                <Feather name="info" size={16} color={colors.accentForeground} style={{ marginTop: 2 }} />
                <View style={{ marginLeft: 12, flex: 1 }}>
                  <Text style={[typography.bodySmall, { color: colors.accentForeground }]}>
                    Fill in your {missingFields.map((f) => PROFILE_FIELD_LABELS[f as keyof typeof PROFILE_FIELD_LABELS]).join(', ')} to settle the doors marked check.
                  </Text>
                  <Link href="/(tabs)/profile" style={{ marginTop: 4 }}>
                    <Text style={[typography.bodySmall, { color: colors.primary, fontWeight: '600' }]}>Complete your profile</Text>
                  </Link>
                </View>
              </View>
            )}

            <TouchableOpacity
              onPress={() => router.push('/path-from-zero')}
              style={[styles.pathCard, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
              accessibilityRole="button"
              accessibilityLabel="Open the Path from zero guide"
              testID="path-from-zero-link"
            >
              <View style={{ flex: 1 }}>
                <Text style={[typography.label, { color: colors.primaryForeground }]}>New to all this?</Text>
                <Text style={[typography.bodySmall, { color: colors.primaryForeground, opacity: 0.85, marginTop: 2 }]}>
                  Path from zero: the route from weak marks to a paid remote role, one step at a time.
                </Text>
              </View>
              <Feather name="arrow-right" size={20} color={colors.primaryForeground} />
            </TouchableOpacity>

            <View style={styles.filterRow}>
              <TouchableOpacity
                onPress={() => setRemoteOnly((v) => !v)}
                style={[
                  styles.chip,
                  { borderColor: remoteOnly ? colors.primary : colors.border, backgroundColor: remoteOnly ? colors.primary : colors.card },
                ]}
                accessibilityRole="switch"
                accessibilityState={{ checked: remoteOnly }}
                accessibilityLabel="Show remote opportunities only"
                testID="filter-remote-only"
              >
                <Feather name="wifi" size={14} color={remoteOnly ? colors.primaryForeground : colors.foreground} />
                <Text style={[typography.label, { color: remoteOnly ? colors.primaryForeground : colors.foreground, marginLeft: 6 }]}>
                  Remote only
                </Text>
              </TouchableOpacity>

              {categoryFilter && (
                <TouchableOpacity
                  onPress={clearCategory}
                  style={[styles.chip, { borderColor: colors.primary, backgroundColor: colors.primary }]}
                  accessibilityRole="button"
                  accessibilityLabel={`Showing only ${CATEGORY_LABELS[categoryFilter]}. Tap to show all categories`}
                  testID="filter-category"
                >
                  <Text style={[typography.label, { color: colors.primaryForeground }]} numberOfLines={1}>
                    {CATEGORY_LABELS[categoryFilter]}
                  </Text>
                  <Feather name="x" size={14} color={colors.primaryForeground} style={{ marginLeft: 6 }} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        renderItem={({ item, index }: any) => (
          <Animated.View entering={FadeInUp.delay(Math.min(index, 8) * 50).springify()}>
            <OpportunityCard
              opportunity={item.opportunity}
              eligibility={item.eligibility}
              isNew={isNew(item.opportunity.id)}
            />
          </Animated.View>
        )}
        renderSectionHeader={({ section: { title, intro, eligibleCount, totalCount } }: any) => (
          <View style={[styles.sectionHeader, { backgroundColor: colors.background }]}>
            <Text style={[typography.h2, { color: colors.foreground }]}>{title}</Text>
            <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 6 }]}>{intro}</Text>
            <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 8 }]}>
              {eligibleCount} of {totalCount} confirmed
            </Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            {categoryFilter ? (
              <>
                <Text style={[typography.h2, { color: colors.foreground }]}>{CATEGORY_LABELS[categoryFilter]}</Text>
                <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 6 }]}>{CATEGORY_INTROS[categoryFilter]}</Text>
                <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 16 }]}>
                  {remoteOnly
                    ? 'Nothing remote is listed here yet. Turn off the remote filter or check back after the next data update.'
                    : 'Nothing is listed here yet, or nothing here is open to your profile. Check back after the next data update.'}
                </Text>
              </>
            ) : (
              <Text style={[typography.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
                {remoteOnly
                  ? 'No remote opportunities match your profile right now.'
                  : 'We did not find any opportunities matching your profile at the moment.'}
              </Text>
            )}
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
    marginBottom: 8,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  pathCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginTop: 16,
    gap: 12,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 8,
    marginBottom: 8,
  },
  emptyContainer: {
    paddingTop: 24,
    paddingHorizontal: 4,
  },
});
