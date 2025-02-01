import { findUserSubscriptionTier } from "./db/userSubscriptions";

export async function canRemoveBranding(userId: string) {
    if (userId) {
        const tier = await findUserSubscriptionTier(userId);
        return tier.canReomveBranding;
    }
    return false;
}

export async function canCustomizeBanner(userId: string) {
    if (userId) {
        const tier = await findUserSubscriptionTier(userId);
        return tier.canCustomizeBanner;
    }
    return false;
}