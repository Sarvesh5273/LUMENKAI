import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useColors } from "@/hooks/useColors";
import { typography } from "@/constants/styles";
import { Opportunity, EligibilityResult, UserProfile } from "@/lib/types";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { formatDeadlineShort } from "@/lib/deadlines";
import { hasNoMarksCutoff, summarizeStatus } from "@/lib/engine";
import { formatBenefitShort, formatLocation } from "@/lib/format";

interface OpportunityCardProps {
  opportunity: Opportunity;
  eligibility: EligibilityResult;
  /** Added to the dataset since the student's last visit. */
  isNew?: boolean;
  onPress?: () => void;
}

export function OpportunityCard({
  opportunity,
  eligibility,
  isNew = false,
  onPress,
}: OpportunityCardProps) {
  const colors = useColors();
  const router = useRouter();

  const handlePress = () => {
    Haptics.selectionAsync().catch(() => {});
    if (onPress) {
      onPress();
      return;
    }
    router.push(`/opportunity/${opportunity.id}`);
  };

  const summary = summarizeStatus(opportunity, eligibility);

  const getStatusColor = () => {
    switch (summary.tone) {
      case "open":
        return colors.success;
      case "closed":
        return colors.destructive;
      case "check":
        return colors.accent;
    }
  };

  const getStatusIcon = () => {
    switch (summary.tone) {
      case "open":
        return "check-circle";
      case "closed":
        return "x-circle";
      case "check":
        return "help-circle";
    }
  };

  const deadlineText = formatDeadlineShort(opportunity.deadline);
  // Only a verified record may wear the badge; an unconfirmed record with
  // empty rules is a gap in our data, not a promise from the program.
  const noCutoffs = opportunity.verification_status === 'verified' && hasNoMarksCutoff(opportunity.rules);
  const moneyText = formatBenefitShort(opportunity.benefit);
  const locationText = formatLocation(opportunity.location);

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={handlePress}
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderRadius: colors.radius,
        },
      ]}
      accessibilityRole="button"
      accessibilityLabel={`Opportunity: ${opportunity.title} at ${opportunity.org}. ${moneyText}. ${locationText}. Status: ${summary.headline}`}
      testID={`opp-card-${opportunity.id}`}
    >
      <View style={styles.header}>
        <View style={styles.orgRow}>
          <Text
            style={[typography.caption, { color: colors.mutedForeground, flex: 1, paddingRight: 8 }]}
            numberOfLines={1}
          >
            {opportunity.org}
          </Text>
          {isNew && (
            <View style={[styles.badge, { backgroundColor: colors.accent, marginRight: 6 }]} testID={`opp-new-${opportunity.id}`}>
              <Text style={[typography.caption, { color: colors.accentForeground, fontSize: 10 }]}>New</Text>
            </View>
          )}
          {noCutoffs && (
            <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
              <Text
                style={[
                  typography.caption,
                  { color: colors.secondaryForeground, fontSize: 10 },
                ]}
              >
                No marks cutoff
              </Text>
            </View>
          )}
        </View>
        <Text
          style={[
            typography.h3,
            { color: colors.cardForeground, marginTop: 4, marginBottom: 8 },
          ]}
          numberOfLines={2}
        >
          {opportunity.title}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="award" size={14} color={colors.foreground} />
            <Text style={[typography.label, { color: colors.cardForeground, marginLeft: 6, flexShrink: 1 }]} numberOfLines={1}>
              {moneyText}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Feather name="map-pin" size={14} color={colors.mutedForeground} />
            <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginLeft: 6, flexShrink: 1 }]} numberOfLines={1}>
              {locationText}
            </Text>
          </View>
        </View>

        <View style={styles.tagsRow}>
          {opportunity.tags.slice(0, 3).map((tag) => (
            <View
              key={tag}
              style={[styles.tag, { backgroundColor: colors.muted }]}
            >
              <Text
                style={[typography.caption, { color: colors.mutedForeground }]}
              >
                {tag}
              </Text>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: colors.border }]}>
        <View style={styles.statusRow}>
          <Feather name={getStatusIcon()} size={16} color={getStatusColor()} />
          <Text
            style={[
              typography.label,
              { color: getStatusColor(), marginLeft: 6 },
            ]}
          >
            {summary.headline}
          </Text>
        </View>
        <View style={styles.deadlineRow}>
          <Feather name="clock" size={14} color={colors.mutedForeground} />
          <Text
            style={[
              typography.caption,
              { color: colors.mutedForeground, marginLeft: 4 },
            ]}
          >
            {deadlineText}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    marginBottom: 12,
    overflow: "hidden",
  },
  header: {
    padding: 16,
  },
  orgRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaRow: {
    marginBottom: 10,
    gap: 4,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 4,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  deadlineRow: {
    flexDirection: "row",
    alignItems: "center",
  },
});
