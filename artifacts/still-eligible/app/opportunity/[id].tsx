import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { OPPORTUNITIES } from '@/data/opportunities';
import { evaluateEligibility } from '@/lib/engine';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const { profile, isTracked, toggleTrackOpp } = useStore();

  const opp = OPPORTUNITIES.find(o => o.id === id);

  const eligibility = useMemo(() => {
    if (!profile || !opp) return null;
    return evaluateEligibility(opp, profile);
  }, [profile, opp]);

  if (!opp || !eligibility) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[typography.body, { color: colors.foreground }]}>Opportunity not found.</Text>
        <Button label="Go Back" onPress={() => router.back()} variant="ghost" style={{ marginTop: 16 }} />
      </View>
    );
  }

  const tracked = isTracked(opp.id);

  const getStatusColor = () => {
    switch (eligibility.status) {
      case 'eligible': return colors.success;
      case 'not_eligible': return colors.destructive;
      case 'unknown': return colors.accent;
    }
  };

  const getStatusIcon = () => {
    switch (eligibility.status) {
      case 'eligible': return 'check-circle';
      case 'not_eligible': return 'x-circle';
      case 'unknown': return 'help-circle';
    }
  };

  const getStatusText = () => {
    switch (eligibility.status) {
      case 'eligible': return 'You Qualify';
      case 'not_eligible': return 'Not Eligible';
      case 'unknown': return 'Verification Needed';
    }
  };

  const openUrl = (url: string) => {
    Linking.openURL(url).catch(() => {});
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleTrackOpp(opp.id)} style={styles.trackButton}>
          <Feather name="star" size={24} color={tracked ? colors.accent : colors.mutedForeground} style={tracked ? styles.iconFilled : {}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}>
        <View style={styles.titleSection}>
          <Text style={[typography.label, { color: colors.mutedForeground, textTransform: 'uppercase' }]}>{opp.company}</Text>
          <Text style={[typography.h1, { color: colors.foreground, marginTop: 4, marginBottom: 12 }]}>{opp.title}</Text>
          
          <View style={styles.tagsRow}>
            {opp.tags.map(tag => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[typography.caption, { color: colors.mutedForeground }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.statusBox, { backgroundColor: getStatusColor() + '15', borderColor: getStatusColor() }]}>
          <Feather name={getStatusIcon()} size={24} color={getStatusColor()} />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={[typography.h3, { color: getStatusColor() }]}>{getStatusText()}</Text>
            {eligibility.status === 'unknown' && (
              <Text style={[typography.bodySmall, { color: getStatusColor(), marginTop: 4 }]}>
                Some rules require data you haven't provided or we couldn't automatically verify them.
              </Text>
            )}
          </View>
        </View>

        {opp.expected_next_cycle && (
          <View style={[styles.infoBox, { backgroundColor: colors.secondary }]}>
            <Feather name="calendar" size={20} color={colors.secondaryForeground} />
            <Text style={[typography.bodySmall, { color: colors.secondaryForeground, marginLeft: 12, flex: 1 }]}>
              This is expected to open in the next annual hiring cycle. Mark it to track.
            </Text>
          </View>
        )}

        <Text style={[typography.h3, { color: colors.foreground, marginTop: 32, marginBottom: 16 }]}>Eligibility Breakdown</Text>
        
        <View style={[styles.rulesContainer, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
          {eligibility.ruleResults.map((result, i) => {
            const ruleColor = result.status === 'pass' ? colors.success : result.status === 'fail' ? colors.destructive : colors.accent;
            const ruleIcon = result.status === 'pass' ? 'check' : result.status === 'fail' ? 'x' : 'help-circle';
            return (
              <View key={i} style={[styles.ruleRow, i !== eligibility.ruleResults.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.ruleIconBox, { backgroundColor: ruleColor + '20' }]}>
                  <Feather name={ruleIcon} size={16} color={ruleColor} />
                </View>
                <Text style={[typography.body, { color: colors.cardForeground, flex: 1, marginLeft: 12 }]}>
                  {result.reason}
                </Text>
              </View>
            );
          })}
        </View>

        {opp.notes ? (
          <View style={{ marginTop: 32 }}>
            <Text style={[typography.h3, { color: colors.foreground, marginBottom: 8 }]}>Notes</Text>
            <Text style={[typography.body, { color: colors.mutedForeground }]}>{opp.notes}</Text>
          </View>
        ) : null}

        <View style={styles.actionSection}>
          <Button 
            label="Visit Official Portal" 
            onPress={() => openUrl(opp.official_url)} 
            size="lg" 
            style={{ width: '100%', marginBottom: 12 }} 
          />
          <Button 
            label={tracked ? "Untrack Opportunity" : "Track Opportunity"} 
            variant="outline"
            onPress={() => toggleTrackOpp(opp.id)} 
            size="lg" 
            style={{ width: '100%' }} 
          />
        </View>

        <Text style={[typography.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 32 }]}>
          Last Verified: {new Date(opp.last_verified).toLocaleDateString()}
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
  },
  trackButton: {
    padding: 8,
    marginRight: -8,
  },
  iconFilled: {
    // Basic fill for the star, since Feather doesn't have solid by default, but we use the trick
    // that feather "star" can't easily be filled unless we use another icon set, but we'll just tint it.
  },
  titleSection: {
    marginBottom: 24,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderRadius: 12,
    marginBottom: 16,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  rulesContainer: {
    borderWidth: 1,
    overflow: 'hidden',
  },
  ruleRow: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  ruleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -2,
  },
  actionSection: {
    marginTop: 40,
  }
});
