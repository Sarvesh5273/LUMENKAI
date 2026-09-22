/**
 * One-off setup of the RevenueCat project for StillEligible.
 *
 * Works inside the project the Replit RevenueCat connection is scoped to
 * (the token cannot create projects) and expects that project to already
 * have a Test Store app, which only the dashboard can add. Creates
 * (idempotently): App Store and Play Store apps, one six-month "Season Pass"
 * subscription per store, the `pro` entitlement, and a current `default`
 * offering with a single `$rc_six_month` package. Prints the public API keys
 * and ids to store as environment variables. Test Store prices are immutable
 * once created.
 *
 *   pnpm --filter @workspace/scripts exec tsx src/seedRevenueCat.ts
 */

import { getUncachableRevenueCatClient } from "./revenueCatClient";

import {
  listProjects,
  listApps,
  createApp,
  listAppPublicApiKeys,
  listProducts,
  createProduct,
  listEntitlements,
  createEntitlement,
  attachProductsToEntitlement,
  listOfferings,
  createOffering,
  updateOffering,
  listPackages,
  createPackages,
  attachProductsToPackage,
  type App,
  type Product,
  type Project,
  type Entitlement,
  type Offering,
  type Package,
  type CreateProductData,
} from "@replit/revenuecat-sdk";

const PROJECT_NAME = "StillEligible";

const PRODUCT_IDENTIFIER = "season_pass_6m";
const PLAY_STORE_PRODUCT_IDENTIFIER = "season_pass_6m:six-months";

const PRODUCT_DISPLAY_NAME = "Season Pass";
const PRODUCT_USER_FACING_TITLE = "Season Pass (6 months)";
const PRODUCT_DURATION = "P6M";

const APP_STORE_APP_NAME = "StillEligible iOS";
const APP_STORE_BUNDLE_ID = "com.stilleligible.app";
const PLAY_STORE_APP_NAME = "StillEligible Android";
const PLAY_STORE_PACKAGE_NAME = "com.stilleligible.app";

const ENTITLEMENT_IDENTIFIER = "pro";
const ENTITLEMENT_DISPLAY_NAME = "Season Pass";

const OFFERING_IDENTIFIER = "default";
const OFFERING_DISPLAY_NAME = "Default Offering";

const PACKAGE_IDENTIFIER = "$rc_six_month";
const PACKAGE_DISPLAY_NAME = "Season Pass, six months";

// amount_micros = price * 1,000,000
const PRODUCT_PRICES = [
  { amount_micros: 149_000_000, currency: "INR" }, // INR 149
  { amount_micros: 1_990_000, currency: "USD" }, // USD 1.99
];

type TestStorePricesResponse = {
  object: string;
  prices: { amount_micros: number; currency: string }[];
};

async function seedRevenueCat() {
  const client = await getUncachableRevenueCatClient();

  // The connector token is scoped to one RevenueCat project, so creating a
  // project fails with authorization_error. Use the project the token can
  // see, preferring one named after the app if there are several.
  const { data: existingProjects, error: listProjectsError } = await listProjects({
    client,
    query: { limit: 20 },
  });
  if (listProjectsError) throw new Error("Failed to list projects: " + JSON.stringify(listProjectsError));
  const projects: Project[] = existingProjects.items ?? [];
  if (projects.length === 0) throw new Error("The RevenueCat connection cannot see any project");
  const project: Project = projects.find((p) => p.name === PROJECT_NAME) ?? projects[0];
  console.log("Using project:", project.id, `(${project.name})`);

  const { data: apps, error: listAppsError } = await listApps({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listAppsError || !apps) throw new Error("Failed to list apps: " + JSON.stringify(listAppsError));

  const app: App | undefined = apps.items.find((a) => a.type === "test_store");
  // Match on the bundle id / package name so a project with several apps
  // cannot receive this app's products by accident.
  let appStoreApp: App | undefined = apps.items.find(
    (a) => a.type === "app_store" && a.app_store?.bundle_id === APP_STORE_BUNDLE_ID,
  );
  let playStoreApp: App | undefined = apps.items.find(
    (a) => a.type === "play_store" && a.play_store?.package_name === PLAY_STORE_PACKAGE_NAME,
  );

  if (!app) {
    // The API refuses type "test_store" on POST /apps; only the dashboard can add one.
    throw new Error(
      `Project ${project.id} (${project.name}) has no Test Store app. Open the project in the RevenueCat dashboard, ` +
        "go to Apps and providers, and create a Test Store under Test configuration, then re-run this script.",
    );
  }
  console.log("App with test store found:", app.id);

  if (!appStoreApp) {
    const { data: newApp, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: APP_STORE_APP_NAME, type: "app_store", app_store: { bundle_id: APP_STORE_BUNDLE_ID } },
    });
    if (error) throw new Error("Failed to create App Store app: " + JSON.stringify(error));
    appStoreApp = newApp;
    console.log("Created App Store app:", appStoreApp.id);
  } else {
    console.log("App Store app found:", appStoreApp.id);
  }

  if (!playStoreApp) {
    const { data: newApp, error } = await createApp({
      client,
      path: { project_id: project.id },
      body: { name: PLAY_STORE_APP_NAME, type: "play_store", play_store: { package_name: PLAY_STORE_PACKAGE_NAME } },
    });
    if (error) throw new Error("Failed to create Play Store app: " + JSON.stringify(error));
    playStoreApp = newApp;
    console.log("Created Play Store app:", playStoreApp.id);
  } else {
    console.log("Play Store app found:", playStoreApp.id);
  }

  const { data: existingProducts, error: listProductsError } = await listProducts({
    client,
    path: { project_id: project.id },
    query: { limit: 100 },
  });
  if (listProductsError) throw new Error("Failed to list products");

  const ensureProductForApp = async (
    targetApp: App,
    label: string,
    productIdentifier: string,
    isTestStore: boolean,
  ): Promise<Product> => {
    const existingProduct = existingProducts.items?.find(
      (p) => p.store_identifier === productIdentifier && p.app_id === targetApp.id,
    );
    if (existingProduct) {
      console.log(label + " product already exists:", existingProduct.id);
      return existingProduct;
    }
    const body: CreateProductData["body"] = {
      store_identifier: productIdentifier,
      app_id: targetApp.id,
      type: "subscription",
      display_name: PRODUCT_DISPLAY_NAME,
    };
    if (isTestStore) {
      body.subscription = { duration: PRODUCT_DURATION };
      body.title = PRODUCT_USER_FACING_TITLE;
    }
    const { data: createdProduct, error } = await createProduct({
      client,
      path: { project_id: project.id },
      body,
    });
    if (error) throw new Error("Failed to create " + label + " product: " + JSON.stringify(error));
    console.log("Created " + label + " product:", createdProduct.id);
    return createdProduct;
  };

  const testStoreProduct = await ensureProductForApp(app, "Test Store", PRODUCT_IDENTIFIER, true);
  const appStoreProduct = await ensureProductForApp(appStoreApp, "App Store", PRODUCT_IDENTIFIER, false);
  const playStoreProduct = await ensureProductForApp(playStoreApp, "Play Store", PLAY_STORE_PRODUCT_IDENTIFIER, false);

  console.log("Adding test store prices for product:", testStoreProduct.id);
  const { data: priceData, error: priceError } = await client.post<TestStorePricesResponse>({
    url: "/projects/{project_id}/products/{product_id}/test_store_prices",
    path: { project_id: project.id, product_id: testStoreProduct.id },
    body: { prices: PRODUCT_PRICES },
  });
  if (priceError) {
    if (typeof priceError === "object" && priceError !== null && "type" in priceError && priceError.type === "resource_already_exists") {
      console.log("Test store prices already exist for this product");
    } else {
      throw new Error("Failed to add test store prices: " + JSON.stringify(priceError));
    }
  } else {
    console.log("Added test store prices:", JSON.stringify((priceData as TestStorePricesResponse | undefined)?.prices));
  }

  let entitlement: Entitlement | undefined;
  const { data: existingEntitlements, error: listEntitlementsError } = await listEntitlements({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listEntitlementsError) throw new Error("Failed to list entitlements");

  const existingEntitlement = existingEntitlements.items?.find((e) => e.lookup_key === ENTITLEMENT_IDENTIFIER);
  if (existingEntitlement) {
    console.log("Entitlement already exists:", existingEntitlement.id);
    entitlement = existingEntitlement;
  } else {
    const { data: newEntitlement, error } = await createEntitlement({
      client,
      path: { project_id: project.id },
      body: { lookup_key: ENTITLEMENT_IDENTIFIER, display_name: ENTITLEMENT_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create entitlement: " + JSON.stringify(error));
    console.log("Created entitlement:", newEntitlement.id);
    entitlement = newEntitlement;
  }

  const { error: attachEntitlementError } = await attachProductsToEntitlement({
    client,
    path: { project_id: project.id, entitlement_id: entitlement.id },
    body: { product_ids: [testStoreProduct.id, appStoreProduct.id, playStoreProduct.id] },
  });
  if (attachEntitlementError) {
    if (attachEntitlementError.type === "unprocessable_entity_error") {
      console.log("Products already attached to entitlement");
    } else {
      throw new Error("Failed to attach products to entitlement: " + JSON.stringify(attachEntitlementError));
    }
  } else {
    console.log("Attached products to entitlement");
  }

  let offering: Offering | undefined;
  const { data: existingOfferings, error: listOfferingsError } = await listOfferings({
    client,
    path: { project_id: project.id },
    query: { limit: 20 },
  });
  if (listOfferingsError) throw new Error("Failed to list offerings");

  const existingOffering = existingOfferings.items?.find((o) => o.lookup_key === OFFERING_IDENTIFIER);
  if (existingOffering) {
    console.log("Offering already exists:", existingOffering.id);
    offering = existingOffering;
  } else {
    const { data: newOffering, error } = await createOffering({
      client,
      path: { project_id: project.id },
      body: { lookup_key: OFFERING_IDENTIFIER, display_name: OFFERING_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create offering: " + JSON.stringify(error));
    console.log("Created offering:", newOffering.id);
    offering = newOffering;
  }

  if (!offering.is_current) {
    const { error } = await updateOffering({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { is_current: true },
    });
    if (error) throw new Error("Failed to set offering as current");
    console.log("Set offering as current");
  }

  let pkg: Package | undefined;
  const { data: existingPackages, error: listPackagesError } = await listPackages({
    client,
    path: { project_id: project.id, offering_id: offering.id },
    query: { limit: 20 },
  });
  if (listPackagesError) throw new Error("Failed to list packages");

  const existingPackage = existingPackages.items?.find((p) => p.lookup_key === PACKAGE_IDENTIFIER);
  if (existingPackage) {
    console.log("Package already exists:", existingPackage.id);
    pkg = existingPackage;
  } else {
    const { data: newPackage, error } = await createPackages({
      client,
      path: { project_id: project.id, offering_id: offering.id },
      body: { lookup_key: PACKAGE_IDENTIFIER, display_name: PACKAGE_DISPLAY_NAME },
    });
    if (error) throw new Error("Failed to create package: " + JSON.stringify(error));
    console.log("Created package:", newPackage.id);
    pkg = newPackage;
  }

  const { error: attachPackageError } = await attachProductsToPackage({
    client,
    path: { project_id: project.id, package_id: pkg.id },
    body: {
      products: [
        { product_id: testStoreProduct.id, eligibility_criteria: "all" },
        { product_id: appStoreProduct.id, eligibility_criteria: "all" },
        { product_id: playStoreProduct.id, eligibility_criteria: "all" },
      ],
    },
  });
  if (attachPackageError) {
    if (attachPackageError.type === "unprocessable_entity_error" && attachPackageError.message?.includes("Cannot attach product")) {
      console.log("Skipping package attach: package already has incompatible product");
    } else {
      throw new Error("Failed to attach products to package: " + JSON.stringify(attachPackageError));
    }
  } else {
    console.log("Attached products to package");
  }

  const keysFor = async (target: App, label: string) => {
    const { data, error } = await listAppPublicApiKeys({ client, path: { project_id: project.id, app_id: target.id } });
    if (error) throw new Error("Failed to list public API keys for " + label);
    return data?.items.map((item) => item.key).join(", ") ?? "N/A";
  };

  console.log("\n====================");
  console.log("RevenueCat setup complete!");
  console.log("Project ID:", project.id);
  console.log("Test Store App ID:", app.id);
  console.log("App Store App ID:", appStoreApp.id);
  console.log("Play Store App ID:", playStoreApp.id);
  console.log("Entitlement Identifier:", ENTITLEMENT_IDENTIFIER);
  console.log("Public API Keys - Test Store:", await keysFor(app, "Test Store"));
  console.log("Public API Keys - App Store:", await keysFor(appStoreApp, "App Store"));
  console.log("Public API Keys - Play Store:", await keysFor(playStoreApp, "Play Store"));
  console.log("====================\n");
}

seedRevenueCat().catch((err) => {
  console.error(err);
  process.exit(1);
});
