import React, { useMemo } from 'react';
import { ActivityIndicator, Platform, SectionList, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { Redirect } from 'expo-router';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { useSubscription } from '@/lib/revenuecat';
import {
  analyzeClosedDoors,
  ClosedDoor,
  describeLadder,
  describeSummary,
  DOOR_GROUP_INTROS,
  DOOR_GROUP_LABELS,
  DOOR_GROUP_ORDER,
  DoorGroup,
} from '@/lib/closed-doors';
import { ClosedDoorCard } from '@/components/ClosedDoorCard';
import { SeasonPassPaywall } from '@/components/SeasonPassPaywall';
import { formatDate, parseIsoDate } from '@/lib/deadlines';

type Section = { group: DoorGroup; title: string; intro: string; data: ClosedDoor[] };

export default function ClosedDoorsScreen() {
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const { profile, isProfileLoaded, records } = useStore();
  const { isSubscribed, expiresAt } = useSubscription();

  const report = useMemo(() => (profile ? analyzeClosedDoors(records, profile) : null), [profile, records]);

  const sections = useMemo<Section[]>(() => {
    if (!report || !isSubscribed) return [];
    return DOOR_GROUP_ORDER.map((group) => ({
      group,
      title: DOOR_GROUP_LABELS[group],
      intro: DOOR_GROUP_INTROS[group],
      data: report.doors.filter((d) => d.group === group),
    })).filter((s) => s.data.length > 0);
  }, [report, isSubscribed]);

  // Opened before onboarding (a deep link or a web reload): there is no
  // profile to judge doors against yet. Hooks above stay unconditional.
  if (isProfileLoaded && !profile) {
    return <Redirect href="/onboarding" />;
  }

  if (!profile || !report) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <ActivityIndicator color={colors.primary} />
      </View>
    );
  }

  const { summary } = report;
  const ladder = describeLadder(summary);
  const expiryDate = expiresAt ? parseIsoDate(expiresAt.slice(0, 10)) : null;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.opportunity.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{
          paddingTop: (Platform.OS === 'web' ? 67 : insets.top) + 24,
          paddingBottom: insets.bottom + 120,
          paddingHorizontal: 20,
        }}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={[typography.h1, { color: colors.foreground }]}>Closed doors</Text>
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 4 }]} testID="closed-summary">
              {describeSummary(summary)}
            </Text>

            {summary.total > 0 && (
              <View style={[styles.countRow, { borderColor: colors.border, borderRadius: colors.radius, backgroundColor: colors.card }]}>
                <Count label="CGPA or backlogs" value={summary.fixable} color={colors.accentForeground} bg={colors.accent} />
                <Count label="Not this cycle" value={summary.later} color={colors.foreground} bg={colors.muted} />
                <Count label="For good" value={summary.permanent} color={colors.destructiveForeground} bg={colors.destructive} />
              </View>
            )}

            {isSubscribed ? (
              <>
                {ladder ? (
                  <View style={[styles.ladder, { backgroundColor: colors.accent + '20', borderColor: colors.accent, borderRadius: colors.radius }]}>
                    <Feather name="trending-up" size={16} color={colors.accentForeground} style={{ marginTop: 2 }} />
                    <Text style={[typography.bodySmall, { color: colors.accentForeground, marginLeft: 12, flex: 1 }]} testID="cgpa-ladder">
                      {ladder}
                    </Text>
                  </View>
                ) : null}
                <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 12 }]} testID="season-pass-active">
                  Season Pass active{expiryDate ? ` until ${formatDate(expiryDate)}` : ''}
                </Text>
              </>
            ) : (
              <View style={{ marginTop: 16 }}>
                <SeasonPassPaywall />
              </View>
            )}
          </View>
        }
        renderSectionHeader={({ section }) => (
          <View style={styles.sectionHeader}>
            <Text style={[typography.h2, { color: colors.foreground }]}>{section.title}</Text>
            <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 6 }]}>{section.intro}</Text>
          </View>
        )}
        renderItem={({ item }) => <ClosedDoorCard door={item} />}
        ListEmptyComponent={
          isSubscribed ? (
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 24 }]}>
              Nothing is closed to you. Every door in the dataset is open or waiting on a profile detail.
            </Text>
          ) : null
        }
      />
    </View>
  );
}

function Count({ label, value, color, bg }: { label: string; value: number; color: string; bg: string }) {
  const colors = useColors();
  return (
    <View style={styles.count}>
      <View style={[styles.countBadge, { backgroundColor: bg }]}>
        <Text style={[typography.h3, { color }]}>{value}</Text>
      </View>
      <Text style={[typography.caption, { color: colors.mutedForeground, marginTop: 6 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    marginBottom: 8,
  },
  countRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderWidth: 1,
    paddingVertical: 14,
    marginTop: 16,
  },
  count: {
    alignItems: 'center',
  },
  countBadge: {
    minWidth: 44,
    height: 44,
    paddingHorizontal: 10,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ladder: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    borderWidth: 1,
    marginTop: 16,
  },
  sectionHeader: {
    paddingTop: 20,
    paddingBottom: 12,
  },
});
