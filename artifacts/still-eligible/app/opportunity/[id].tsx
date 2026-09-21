import React, { useMemo } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Linking, Share } from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { useStore } from '@/lib/store';
import { findOpportunity } from '@/data';
import { evaluateEligibility, summarizeStatus } from '@/lib/engine';
import { Feather } from '@expo/vector-icons';
import { Button } from '@/components/Button';
import { CATEGORY_LABELS } from '@/lib/types';
import { formatDeadlineLong, formatDate, parseIsoDate, isExpectedNextCycle } from '@/lib/deadlines';
import * as WebBrowser from 'expo-web-browser';

export default function OpportunityDetailScreen() {
  const { id } = useLocalSearchParams();
  const insets = useSafeAreaInsets();
  const colors = useColors();
  const router = useRouter();
  const { profile, isTracked, toggleTrackOpp } = useStore();

  const opp = findOpportunity(id as string);

  // A deep link (or a web reload on this screen) has no history to pop.
  const goBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  const eligibility = useMemo(() => {
    if (!profile || !opp) return null;
    return evaluateEligibility(opp, profile);
  }, [profile, opp]);

  if (!opp || !eligibility) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' }]}>
        <Text style={[typography.body, { color: colors.foreground }]}>Opportunity not found.</Text>
        <Button label="Go back" onPress={goBack} variant="ghost" style={{ marginTop: 16 }} />
      </View>
    );
  }

  const tracked = isTracked(opp.id);
  const summary = summarizeStatus(opp, eligibility);

  const getStatusColor = () => {
    switch (summary.tone) {
      case 'open': return colors.success;
      case 'closed': return colors.destructive;
      case 'check': return colors.accent;
    }
  };

  const getStatusIcon = () => {
    switch (summary.tone) {
      case 'open': return 'check-circle';
      case 'closed': return 'x-circle';
      case 'check': return 'help-circle';
    }
  };

  const openUrlBrowser = async (url: string) => {
    await WebBrowser.openBrowserAsync(url);
  };

  const allRules = [
    ...eligibility.passed,
    ...eligibility.noRule,
    ...eligibility.unknown,
    ...eligibility.failed
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + 16, paddingHorizontal: 20 }]}>
        <TouchableOpacity onPress={goBack} style={styles.backButton} accessibilityRole="button" accessibilityLabel="Go back">
          <Feather name="chevron-left" size={28} color={colors.foreground} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => toggleTrackOpp(opp.id)} style={styles.trackButton} accessibilityRole="button" accessibilityLabel={tracked ? 'Stop tracking this opportunity' : 'Track this opportunity'} accessibilityState={{ selected: tracked }}>
          <Feather name="star" size={24} color={tracked ? colors.accent : colors.mutedForeground} style={tracked ? styles.iconFilled : {}} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: insets.bottom + 40 }}>
        <View style={styles.titleSection}>
          <Text style={[typography.label, { color: colors.mutedForeground, textTransform: 'uppercase' }]}>{opp.org}</Text>
          <Text style={[typography.h1, { color: colors.foreground, marginTop: 4, marginBottom: 8 }]}>{opp.title}</Text>
          <Text style={[typography.body, { color: colors.foreground, marginBottom: 12 }]}>{opp.summary}</Text>
          
          <View style={styles.tagsRow}>
            <View style={[styles.tag, { backgroundColor: colors.muted }]}>
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>{CATEGORY_LABELS[opp.category]}</Text>
            </View>
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
            <Text style={[typography.h3, { color: getStatusColor() }]}>{summary.headline}</Text>
            {eligibility.status === 'unknown' && (
              <Text style={[typography.bodySmall, { color: getStatusColor(), marginTop: 4 }]}>
                {eligibility.missingFields.length > 0
                  ? 'Add the missing details in your profile to settle this.'
                  : 'The program has not published enough to settle this yet. See the rule below.'}
              </Text>
            )}
          </View>
        </View>

        <View style={[styles.infoBox, { backgroundColor: colors.secondary, marginBottom: 16 }]}>
          <Feather name="calendar" size={20} color={colors.secondaryForeground} />
          <Text style={[typography.bodySmall, { color: colors.secondaryForeground, marginLeft: 12, flex: 1 }]}>
            {formatDeadlineLong(opp)}
          </Text>
        </View>

        {opp.verification_status === 'needs_check' && (
          <View style={[styles.infoBox, { backgroundColor: colors.accent + '20', marginBottom: 16 }]}>
            <Feather name="alert-circle" size={20} color={colors.accentForeground} />
            <Text style={[typography.bodySmall, { color: colors.accentForeground, marginLeft: 12, flex: 1 }]}>
              The criteria could not be fully confirmed on the official page. Read the notes section below before applying.
            </Text>
          </View>
        )}

        <Text style={[typography.h3, { color: colors.foreground, marginTop: 16, marginBottom: 16 }]}>
          {summary.tone === 'open'
            ? 'Why you qualify'
            : summary.tone === 'closed'
              ? 'Why this door is closed'
              : 'Rule by rule'}
        </Text>
        
        <View style={[styles.rulesContainer, { borderColor: colors.border, backgroundColor: colors.card, borderRadius: colors.radius }]}>
          {allRules.map((result, i) => {
            const unconfirmedNoRule = result.status === 'no_rule' && opp.verification_status === 'needs_check';
            const ruleColor = result.status === 'fail' ? colors.destructive : result.status === 'unknown' || unconfirmedNoRule ? colors.accent : colors.success;
            const ruleIcon = result.status === 'fail' ? 'x' : result.status === 'unknown' || unconfirmedNoRule ? 'help-circle' : 'check';
            return (
              <View key={i} style={[styles.ruleRow, i !== allRules.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border }]}>
                <View style={[styles.ruleIconBox, { backgroundColor: ruleColor + '20' }]}>
                  <Feather name={ruleIcon} size={16} color={ruleColor} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginBottom: 2 }]}>{result.label}</Text>
                  <Text style={[typography.body, { color: colors.cardForeground }]}>
                    {result.reason}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {opp.notes ? (
          <View style={{ marginTop: 32 }}>
            <Text style={[typography.h3, { color: colors.foreground, marginBottom: 8 }]}>Notes</Text>
            <Text style={[typography.body, { color: colors.foreground }]}>{opp.notes}</Text>
          </View>
        ) : null}

        {opp.alternative_ids.length > 0 && (
          <View style={{ marginTop: 32 }}>
            <Text style={[typography.h3, { color: colors.foreground, marginBottom: 12 }]}>Alternatives</Text>
            {opp.alternative_ids.map(altId => {
              const altOpp = findOpportunity(altId);
              if (!altOpp) return null;
              return (
                <Link key={altId} href={`/opportunity/${altId}`} style={{ marginBottom: 12 }}>
                  <Text style={[typography.body, { color: colors.primary, textDecorationLine: 'underline' }]}>
                    {altOpp.title} ({altOpp.org})
                  </Text>
                </Link>
              );
            })}
          </View>
        )}

        <View style={styles.actionSection}>
          <Button 
            label="Apply" 
            onPress={() => openUrlBrowser(opp.official_url)} 
            size="lg" 
            style={{ width: '100%', marginBottom: 12 }} 
          />
          <Button 
            label="Source" 
            variant="secondary"
            onPress={() => openUrlBrowser(opp.source_url)} 
            size="lg" 
            style={{ width: '100%', marginBottom: 12 }} 
          />
          <Button 
            label={tracked ? "Untrack" : "Track"} 
            variant="outline"
            onPress={() => toggleTrackOpp(opp.id)} 
            size="lg" 
            style={{ width: '100%' }} 
          />
        </View>

        <Text style={[typography.caption, { color: colors.mutedForeground, textAlign: 'center', marginTop: 32 }]}>
          Last verified {opp.last_verified ? formatDate(parseIsoDate(opp.last_verified)!) : 'Unknown'}
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
