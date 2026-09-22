import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { ClosedDoor, describeCaveat, describeFix, describeWait } from '@/lib/closed-doors';
import { formatDeadlineShort } from '@/lib/deadlines';
import { formatBenefitShort } from '@/lib/format';

interface ClosedDoorCardProps {
  door: ClosedDoor;
}

/**
 * One closed door: what it pays, which rule shuts it, and the fix line when
 * there is one. Tapping opens the normal detail screen.
 */
export function ClosedDoorCard({ door }: ClosedDoorCardProps) {
  const colors = useColors();
  const router = useRouter();
  const { opportunity, blockers, fixes, group, openAlternatives } = door;

  const open = (id: string) => {
    Haptics.selectionAsync().catch(() => {});
    router.push(`/opportunity/${id}`);
  };

  const waitLine = group === 'later' ? describeWait(door) : '';
  // A fix clears a known blocker; it does not settle rules the engine could
  // not check, or a record whose criteria were never fully confirmed.
  const caveat = fixes.length > 0 ? describeCaveat(door) : '';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => open(opportunity.id)}
      style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]}
      accessibilityRole="button"
      accessibilityLabel={`${opportunity.title} at ${opportunity.org}. Closed: ${blockers.map((b) => b.label).join(', ')}`}
      testID={`closed-door-${opportunity.id}`}
    >
      <Text style={[typography.caption, { color: colors.mutedForeground }]} numberOfLines={1}>
        {opportunity.org}
      </Text>
      <Text style={[typography.h3, { color: colors.cardForeground, marginTop: 4 }]} numberOfLines={2}>
        {opportunity.title}
      </Text>
      <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 4 }]} numberOfLines={1}>
        {formatBenefitShort(opportunity.benefit)}. {formatDeadlineShort(opportunity.deadline)}.
      </Text>

      <View style={[styles.divider, { backgroundColor: colors.border }]} />

      {blockers.map((rule) => (
        <View key={rule.key} style={styles.line}>
          <Feather name="x" size={14} color={colors.destructive} style={styles.lineIcon} />
          <Text style={[typography.bodySmall, { color: colors.cardForeground, flex: 1 }]}>{rule.reason}</Text>
        </View>
      ))}

      {fixes.map((fix) => (
        <View key={fix.kind} style={[styles.fixBox, { backgroundColor: colors.accent + '20', borderRadius: colors.radius - 4 }]}>
          <Feather name="key" size={14} color={colors.accentForeground} style={styles.lineIcon} />
          <Text style={[typography.label, { color: colors.accentForeground, flex: 1 }]}>{describeFix(fix)}</Text>
        </View>
      ))}

      {caveat ? (
        <View style={styles.line}>
          <Feather name="help-circle" size={14} color={colors.mutedForeground} style={styles.lineIcon} />
          <Text style={[typography.bodySmall, { color: colors.mutedForeground, flex: 1 }]} testID={`caveat-${opportunity.id}`}>
            {caveat}
          </Text>
        </View>
      ) : null}

      {waitLine ? (
        <View style={styles.line}>
          <Feather name="clock" size={14} color={colors.mutedForeground} style={styles.lineIcon} />
          <Text style={[typography.bodySmall, { color: colors.mutedForeground, flex: 1 }]}>{waitLine}</Text>
        </View>
      ) : null}

      {openAlternatives.length > 0 && (
        <View style={styles.alternatives}>
          <Text style={[typography.caption, { color: colors.mutedForeground }]}>Try instead</Text>
          {openAlternatives.map((alt) => (
            <TouchableOpacity
              key={alt.id}
              onPress={() => open(alt.id)}
              accessibilityRole="link"
              accessibilityLabel={`Open ${alt.title}`}
              style={{ marginTop: 4 }}
            >
              <Text style={[typography.bodySmall, { color: colors.primary, textDecorationLine: 'underline' }]}>
                {alt.title} ({alt.org})
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  line: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  lineIcon: {
    marginTop: 3,
    marginRight: 8,
  },
  fixBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 10,
    marginTop: 4,
    marginBottom: 6,
  },
  alternatives: {
    marginTop: 8,
  },
});
