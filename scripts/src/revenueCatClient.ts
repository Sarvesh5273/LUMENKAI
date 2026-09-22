/**
 * Authenticated RevenueCat REST v2 client for standalone scripts.
 *
 * Auth goes through the Replit RevenueCat connector: the connectors SDK
 * injects the token on every request, so no API key lives in this repo.
 * Tokens expire, so call getUncachableRevenueCatClient() per operation
 * instead of caching the client.
 */

import { ReplitConnectors } from "@replit/connectors-sdk";
import { createClient } from "@replit/revenuecat-sdk/client";

export async function getUncachableRevenueCatClient() {
  const connectors = new ReplitConnectors();
  const proxyFetch = connectors.createProxyFetch("revenuecat");
  return createClient({
    baseUrl: "https://api.revenuecat.com/v2",
    fetch: proxyFetch,
  });
}
