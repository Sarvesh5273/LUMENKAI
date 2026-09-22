import React, { useState } from 'react';
import { ActivityIndicator, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useColors } from '@/hooks/useColors';
import { typography } from '@/constants/styles';
import { Button } from '@/components/Button';
import { REVENUECAT_ENTITLEMENT_IDENTIFIER, useSubscription } from '@/lib/revenuecat';

const WHAT_YOU_GET = [
  'Every door your profile fails, with the exact rule that shuts it.',
  'Where CGPA or backlogs are the problem, the smallest change that clears them, door by door.',
  'Which doors come back next cycle and which are closed for good, so you stop chasing them.',
  'Works offline like the rest of the app. One pass covers a six-month placement season.',
];

function errorMessage(err: unknown): string | null {
  if (typeof err === 'object' && err !== null) {
    if ('userCancelled' in err && (err as { userCancelled?: boolean }).userCancelled) return null;
    if ('message' in err && typeof (err as { message?: unknown }).message === 'string') {
      return (err as { message: string }).message;
    }
  }
  return 'Something went wrong. Nothing was charged.';
}

/**
 * The only place the Season Pass is sold. Price and product name come from
 * RevenueCat's current offering, never from a constant in the app.
 */
export function SeasonPassPaywall() {
  const colors = useColors();
  const {
    isAvailable,
    unavailableReason,
    usingTestStore,
    seasonPass,
    isLoading,
    loadError,
    purchase,
    restore,
    isPurchasing,
    isRestoring,
    refresh,
  } = useSubscription();
  const [confirming, setConfirming] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const price = seasonPass?.product.priceString ?? null;

  const buy = async () => {
    if (!seasonPass) return;
    setNote(null);
    setConfirming(false);
    try {
      await purchase(seasonPass);
    } catch (err) {
      const message = errorMessage(err);
      if (message) setNote(message);
    }
  };

  const onBuyPress = () => {
    if (usingTestStore) {
      setConfirming(true);
      return;
    }
    void buy();
  };

  const onRestore = async () => {
    setNote(null);
    try {
      const info = await restore();
      const restored = info.entitlements.active[REVENUECAT_ENTITLEMENT_IDENTIFIER] !== undefined;
      setNote(restored ? 'Season Pass restored.' : 'No earlier Season Pass found for this store account.');
    } catch (err) {
      const message = errorMessage(err);
      if (message) setNote(message);
    }
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius }]} testID="season-pass-paywall">
      <View style={styles.titleRow}>
        <View style={[styles.iconBox, { backgroundColor: colors.accent }]}>
          <Feather name="key" size={18} color={colors.accentForeground} />
        </View>
        <Text style={[typography.h2, { color: colors.cardForeground, marginLeft: 12 }]}>Season Pass</Text>
      </View>
      <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 8 }]}>
        The free feed shows the doors that are open. The pass shows the ones that are shut, which rule shuts each, and the fix where there is one.
      </Text>

      <View style={styles.list}>
        {WHAT_YOU_GET.map((line) => (
          <View key={line} style={styles.listRow}>
            <Feather name="check" size={16} color={colors.success} style={{ marginTop: 3, marginRight: 10 }} />
            <Text style={[typography.body, { color: colors.cardForeground, flex: 1 }]}>{line}</Text>
          </View>
        ))}
      </View>

      {!isAvailable ? (
        <Text style={[typography.bodySmall, { color: colors.destructive }]} testID="paywall-unavailable">
          Purchases are not available in this build. {unavailableReason}
        </Text>
      ) : isLoading ? (
        <ActivityIndicator color={colors.primary} style={{ marginVertical: 12 }} />
      ) : loadError || !seasonPass ? (
        <View>
          <Text style={[typography.bodySmall, { color: colors.destructive }]} testID="paywall-load-error">
            {loadError ? `Could not load the pass: ${loadError.message}` : 'The Season Pass is not on sale right now.'}
          </Text>
          <Button label="Try again" variant="outline" onPress={() => { void refresh(); }} style={{ marginTop: 12 }} />
        </View>
      ) : (
        <View>
          <Button
            label={price ? `Get the Season Pass for ${price}` : 'Get the Season Pass'}
            size="lg"
            onPress={onBuyPress}
            loading={isPurchasing}
            disabled={isPurchasing || isRestoring}
            style={{ width: '100%' }}
            testID="buy-season-pass"
          />
          <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: 10 }]}>
            {seasonPass.product.title}. Renews every six months until you cancel it in your store account. Tracking and the open doors feed stay free.
          </Text>
        </View>
      )}

      {isAvailable && !isLoading ? (
        <TouchableOpacity
          onPress={() => { void onRestore(); }}
          disabled={isPurchasing || isRestoring}
          style={{ marginTop: 12, alignSelf: 'flex-start' }}
          accessibilityRole="button"
          accessibilityLabel="Restore an earlier purchase"
          testID="restore-purchases"
        >
          <Text style={[typography.label, { color: colors.primary, textDecorationLine: 'underline' }]}>
            {isRestoring ? 'Restoring...' : 'Already bought it? Restore'}
          </Text>
        </TouchableOpacity>
      ) : null}

      {note ? (
        <Text style={[typography.bodySmall, { color: colors.foreground, marginTop: 12 }]} testID="paywall-note">
          {note}
        </Text>
      ) : null}

      <Modal visible={confirming} transparent animationType="fade" onRequestClose={() => setConfirming(false)}>
        <View style={styles.backdrop}>
          <View style={[styles.dialog, { backgroundColor: colors.card, borderRadius: colors.radius }]} testID="test-purchase-confirm">
            <Text style={[typography.h3, { color: colors.cardForeground }]}>Test purchase</Text>
            <Text style={[typography.body, { color: colors.mutedForeground, marginTop: 8 }]}>
              This build uses RevenueCat's Test Store. Buying {seasonPass?.product.title ?? 'the pass'}
              {price ? ` for ${price}` : ''} is simulated and charges nothing.
            </Text>
            <View style={styles.dialogButtons}>
              <Button label="Cancel" variant="outline" onPress={() => setConfirming(false)} style={{ flex: 1 }} />
              <Button label="Continue" onPress={() => { void buy(); }} style={{ flex: 1 }} testID="confirm-test-purchase" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  list: {
    marginVertical: 16,
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    padding: 20,
  },
  dialogButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
});
