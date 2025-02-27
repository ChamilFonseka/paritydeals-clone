export type TierNames = keyof typeof subscriptionTires;

export type PaidTierNames = Exclude<TierNames, "Free">;

export const subscriptionTires = {
    Free: {
        name: "Free",
        priceInCents: 0,
        maxNumberOfProducts: 1,
        maxNumberOfVisits: 5000,
        canAccessAnalytics: false,
        canCustomizeBanner: false,
        canReomveBranding: false,
        stripePriceId: null,
    },
    Basic: {
        name: "Basic",
        priceInCents: 1900,
        maxNumberOfProducts: 5,
        maxNumberOfVisits: 10000,
        canAccessAnalytics: true,
        canCustomizeBanner: false,
        canReomveBranding: true,
        stripePriceId: process.env.BASIC_PLAN_STRIPE_PRICE_ID,
    },
    Standard: {
        name: "Standard",
        priceInCents: 4900,
        maxNumberOfProducts: 30,
        maxNumberOfVisits: 100000,
        canAccessAnalytics: true,
        canCustomizeBanner: true,
        canReomveBranding: true,
        stripePriceId: process.env.STANDARD_PLAN_STRIPE_PRICE_ID,
    },
    Premium: {
        name: "Premium",
        priceInCents: 9900,
        maxNumberOfProducts: 50,
        maxNumberOfVisits: 1000000,
        canAccessAnalytics: true,
        canCustomizeBanner: true,
        canReomveBranding: true,
        stripePriceId: process.env.PREMIUM_PLAN_STRIPE_PRICE_ID,
    },
} as const;

export const subscriptionTiresInOrder = [
    subscriptionTires.Free,
    subscriptionTires.Basic,
    subscriptionTires.Standard,
    subscriptionTires.Premium,
] as const;

export function getTierByPriceId(stripePriceId: string) {
    return Object.values(subscriptionTires).find(
        tier => tier.stripePriceId === stripePriceId
    );
}