import { getProductCount } from "./db/products";
import { findUserSubscriptionTier } from "./db/userSubscriptions";

export async function canRemoveBranding(userId: string | null) {
    if (userId) {
        const tier = await findUserSubscriptionTier(userId);
        return tier.canReomveBranding;
    }
    return false;
}

export async function canCustomizeBanner(userId: string | null) {
    if (userId) {
        const tier = await findUserSubscriptionTier(userId);
        return tier.canCustomizeBanner;
    }
    return false;
}

export async function canCreateProduct(userId: string | null) {
    if (userId) {
        const tier = await findUserSubscriptionTier(userId);
        const productCount = await getProductCount(userId);
        return productCount < tier.maxNumberOfProducts;
    }
    return false;
}