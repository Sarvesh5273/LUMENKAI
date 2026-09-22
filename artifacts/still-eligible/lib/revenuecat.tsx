/**
 * RevenueCat wiring for the Season Pass.
 *
 * One entitlement, `pro`, unlocks "Closed doors, with the fix". RevenueCat is
 * the only source of truth for whether a device has it; nothing about the
 * purchase is stored in AsyncStorage.
 *
 * Key selection: development builds, the web preview and Expo Go use the
 * Test Store key (purchases are simulated and never charge anyone). Release
 * builds use the store key for their platform. The keys are public
 * identifiers, shipped in the bundle like any EXPO_PUBLIC_ value.
 *
 * If the keys are missing the app still runs; the Season Pass screen says
 * purchases are unavailable instead of the whole app failing to boot.
 */

import React, { createContext, useContext, useEffect } from 'react';
import { Platform } from 'react-native';
import Purchases, { CustomerInfo, PurchasesOfferings, PurchasesPackage } from 'react-native-purchases';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Constants from 'expo-constants';

const REVENUECAT_TEST_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_TEST_API_KEY;
const REVENUECAT_IOS_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_IOS_API_KEY;
const REVENUECAT_ANDROID_API_KEY = process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY;

export const REVENUECAT_ENTITLEMENT_IDENTIFIER = 'pro';
/** The package the seed script puts in the `default` offering. */
export const REVENUECAT_PACKAGE_IDENTIFIER = '$rc_six_month';

/**
 * Where simulated (Test Store) purchases are acceptable: any development
 * build, the web dev preview, and Expo Go. A production web build never gets
 * a store key: nothing there could take real money, and a Test Store key on a
 * public URL would hand out the entitlement for free.
 */
function shouldUseTestStore(): boolean {
  return __DEV__ || Constants.executionEnvironment === 'storeClient';
}

function getRevenueCatApiKey(): string {
  if (Platform.OS === 'web' && !__DEV__) {
    throw new Error('The Season Pass is sold in the Android and iOS apps, not on the web.');
  }
  const [name, key] = shouldUseTestStore()
    ? ['EXPO_PUBLIC_REVENUECAT_TEST_API_KEY', REVENUECAT_TEST_API_KEY]
    : Platform.OS === 'ios'
      ? ['EXPO_PUBLIC_REVENUECAT_IOS_API_KEY', REVENUECAT_IOS_API_KEY]
      : ['EXPO_PUBLIC_REVENUECAT_ANDROID_API_KEY', REVENUECAT_ANDROID_API_KEY];
  if (!key) throw new Error(`RevenueCat key ${name} is not set for this build.`);
  return key;
}

type SetupState = { configured: true; usingTestStore: boolean } | { configured: false; error: string };

let setupState: SetupState = { configured: false, error: 'RevenueCat has not been initialised.' };

/**
 * Configure the SDK once at app start. Throws when the keys are missing so
 * the caller can decide how loud to be; the failure is also remembered here
 * so the paywall can explain itself.
 */
export function initializeRevenueCat(): void {
  try {
    const apiKey = getRevenueCatApiKey();
    if (__DEV__) Purchases.setLogLevel(Purchases.LOG_LEVEL.DEBUG);
    Purchases.configure({ apiKey });
    setupState = { configured: true, usingTestStore: apiKey.startsWith('test_') };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    setupState = { configured: false, error: message };
    throw err;
  }
}

const CUSTOMER_INFO_KEY = ['revenuecat', 'customer-info'] as const;

function useSubscriptionContext() {
  const configured = setupState.configured;
  const queryClient = useQueryClient();

  const customerInfoQuery = useQuery<CustomerInfo>({
    queryKey: CUSTOMER_INFO_KEY,
    queryFn: () => Purchases.getCustomerInfo(),
    staleTime: 60 * 1000,
    enabled: configured,
  });

  // The SDK pushes fresh customer info after purchases made elsewhere,
  // renewals, refunds and expiry; keep the cached copy in step with it.
  useEffect(() => {
    if (!configured) return;
    const listener = (info: CustomerInfo) => {
      queryClient.setQueryData(CUSTOMER_INFO_KEY, info);
    };
    Purchases.addCustomerInfoUpdateListener(listener);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(listener);
    };
  }, [configured, queryClient]);

  const offeringsQuery = useQuery<PurchasesOfferings>({
    queryKey: ['revenuecat', 'offerings'],
    queryFn: () => Purchases.getOfferings(),
    staleTime: 300 * 1000,
    enabled: configured,
  });

  const purchaseMutation = useMutation({
    mutationFn: async (packageToPurchase: PurchasesPackage) => {
      const { customerInfo } = await Purchases.purchasePackage(packageToPurchase);
      return customerInfo;
    },
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const restoreMutation = useMutation({
    mutationFn: () => Purchases.restorePurchases(),
    onSuccess: () => customerInfoQuery.refetch(),
  });

  const activeEntitlement = customerInfoQuery.data?.entitlements.active?.[REVENUECAT_ENTITLEMENT_IDENTIFIER];
  const packages = offeringsQuery.data?.current?.availablePackages ?? [];
  const seasonPass = packages.find((p) => p.identifier === REVENUECAT_PACKAGE_IDENTIFIER) ?? packages[0] ?? null;

  return {
    /** False when the keys are missing; `unavailableReason` says why. */
    isAvailable: configured,
    unavailableReason: setupState.configured ? null : setupState.error,
    usingTestStore: setupState.configured ? setupState.usingTestStore : false,
    customerInfo: customerInfoQuery.data,
    offerings: offeringsQuery.data,
    /** The package to sell, from the current offering. */
    seasonPass,
    isSubscribed: activeEntitlement !== undefined,
    /** ISO date the current period ends, or null for a lifetime or unknown expiry. */
    expiresAt: activeEntitlement?.expirationDate ?? null,
    isLoading: configured && (customerInfoQuery.isLoading || offeringsQuery.isLoading),
    loadError: (customerInfoQuery.error ?? offeringsQuery.error) as Error | null,
    purchase: purchaseMutation.mutateAsync,
    restore: restoreMutation.mutateAsync,
    isPurchasing: purchaseMutation.isPending,
    isRestoring: restoreMutation.isPending,
    refresh: () => Promise.all([customerInfoQuery.refetch(), offeringsQuery.refetch()]),
  };
}

type SubscriptionContextValue = ReturnType<typeof useSubscriptionContext>;
const Context = createContext<SubscriptionContextValue | null>(null);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const value = useSubscriptionContext();
  return <Context.Provider value={value}>{children}</Context.Provider>;
}

export function useSubscription() {
  const ctx = useContext(Context);
  if (!ctx) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return ctx;
}
