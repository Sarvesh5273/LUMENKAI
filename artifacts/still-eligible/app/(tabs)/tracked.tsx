import React, { useMemo } from 'react';
import { StyleSheet, Text, View, FlatList, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { findOpportunity } from '@/data';
import { evaluateEligibility } from '@/lib/engine';
import { deadlineSortValue } from '@/lib/deadlines';
import { OpportunityCard } from '@/components/OpportunityCard';
import Animated, { FadeInUp } from 'react-native-reanimated';

export default function TrackedScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile, trackedOppIds } = useStore();

  const trackedItems = useMemo(() => {
    if (!profile) return [];
    const items = [];
    for (const id of trackedOppIds) {
      const opp = findOpportunity(id);
      if (opp) {
        items.push({
          opportunity: opp,
          eligibility: evaluateEligibility(opp, profile)
        });
      }
    }
    return items.sort((a, b) => deadlineSortValue(a.opportunity.deadline) - deadlineSortValue(b.opportunity.deadline));
  }, [profile, trackedOppIds]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={trackedItems}
        keyExtractor={(item) => item.opportunity.id}
        contentContainerStyle={{ 
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20 
        }}
        ListHeaderComponent={(
          <View style={styles.header}>
            <Text style={[typography.h1, { color: colors.foreground }]}>Tracked</Text>
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 4 }]}>
              Your shortlisted opportunities.
            </Text>
          </View>
        )}
        renderItem={({ item, index }) => (
          <Animated.View entering={FadeInUp.delay(index * 50).springify()}>
            <OpportunityCard 
              opportunity={item.opportunity} 
              eligibility={item.eligibility} 
            />
          </Animated.View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={[typography.body, { color: colors.mutedForeground, textAlign: 'center' }]}>
              You haven't tracked any opportunities yet.
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
  header: {
    marginBottom: 24,
  },
  emptyContainer: {
    paddingTop: 40,
    alignItems: 'center',
    paddingHorizontal: 24,
  }
});
