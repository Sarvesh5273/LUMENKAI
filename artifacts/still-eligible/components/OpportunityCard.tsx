import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useColors } from '@/hooks/useColors';
import { typography, layout } from '@/constants/styles';
import { Opportunity, EligibilityResult } from '@/lib/types';
import { Feather } from '@expo/vector-icons';
import { Link } from 'expo-router';

interface OpportunityCardProps {
  opportunity: Opportunity;
  eligibility: EligibilityResult;
  onPress?: () => void;
}

export function OpportunityCard({ opportunity, eligibility }: OpportunityCardProps) {
  const colors = useColors();

  const getStatusColor = () => {
    switch (eligibility.status) {
      case 'eligible': return colors.success;
      case 'not_eligible': return colors.destructive;
      case 'unknown': return colors.accent;
    }
  };

  const getStatusText = () => {
    switch (eligibility.status) {
      case 'eligible': return 'You qualify';
      case 'not_eligible': return 'Not eligible';
      case 'unknown': return 'Verify rules';
    }
  };

  const getStatusIcon = () => {
    switch (eligibility.status) {
      case 'eligible': return 'check-circle';
      case 'not_eligible': return 'x-circle';
      case 'unknown': return 'help-circle';
    }
  };

  return (
    <Link href={`/opportunity/${opportunity.id}`} asChild>
      <TouchableOpacity 
        activeOpacity={0.7} 
        style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
        accessibilityRole="button"
        accessibilityLabel={`Opportunity: ${opportunity.title} at ${opportunity.company}. Status: ${getStatusText()}`}
        testID={`opp-card-${opportunity.id}`}
      >
        <View style={styles.header}>
          <View style={styles.companyRow}>
            <Text style={[typography.caption, { color: colors.mutedForeground }]} numberOfLines={1}>
              {opportunity.company}
            </Text>
            {opportunity.expected_next_cycle && (
              <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
                <Text style={[typography.caption, { color: colors.secondaryForeground, fontSize: 10 }]}>Expected Soon</Text>
              </View>
            )}
          </View>
          <Text style={[typography.h3, { color: colors.cardForeground, marginTop: 4, marginBottom: 8 }]} numberOfLines={2}>
            {opportunity.title}
          </Text>
          
          <View style={styles.tagsRow}>
            {opportunity.tags.slice(0, 3).map(tag => (
              <View key={tag} style={[styles.tag, { backgroundColor: colors.muted }]}>
                <Text style={[typography.caption, { color: colors.mutedForeground }]}>{tag}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={[styles.footer, { borderTopColor: colors.border }]}>
          <View style={styles.statusRow}>
            <Feather name={getStatusIcon()} size={16} color={getStatusColor()} />
            <Text style={[typography.label, { color: getStatusColor(), marginLeft: 6 }]}>
              {getStatusText()}
            </Text>
          </View>
          {opportunity.deadline && (
            <View style={styles.deadlineRow}>
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={[typography.caption, { color: colors.mutedForeground, marginLeft: 4 }]}>
                {new Date(opportunity.deadline).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: 'hidden',
  },
  header: {
    padding: 16,
  },
  companyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deadlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  }
});
