import { startOfMonth } from "date-fns";
import { getProductCount } from "./db/products";
import { getProductViewCount } from "./db/productViews";
import { findUserSubscriptionTier } from "./db/userSubscriptions";

export async function canRemoveBranding(userId: string | null) {
    if (userId == null) return false;
    const tier = await findUserSubscriptionTier(userId);
    return tier.canReomveBranding;
}

export async function canCustomizeBanner(userId: string | null) {
    if (userId == null) return false;
    const tier = await findUserSubscriptionTier(userId);
    return tier.canCustomizeBanner;
}

export async function canAccessAnalytics(userId: string | null) {
    if (userId == null) return false;
    const tier = await findUserSubscriptionTier(userId);
    return tier.canAccessAnalytics;
}

export async function canCreateProduct(userId: string | null) {
    if (userId == null) return false;
    const tier = await findUserSubscriptionTier(userId);
    const productCount = await getProductCount(userId);
    return productCount < tier.maxNumberOfProducts;
}

export async function canShowDiscountBanner(userId: string | null) {
    if (userId == null) return false;
    const tier = await findUserSubscriptionTier(userId);
    const productViews = await getProductViewCount(
        userId,
        startOfMonth(new Date())
    );
    return productViews < tier.maxNumberOfVisits;
}