import { subscriptionTires, TierNames } from "@/data/subscriptionTires";
import { relations } from "drizzle-orm";
import { pgTable, text, timestamp, uuid, index, boolean, real, primaryKey, pgEnum } from "drizzle-orm/pg-core";

const createdAt = timestamp('created_at', { withTimezone: true }).defaultNow();
const updatedAt = timestamp('updated_at', { withTimezone: true }).defaultNow();

export const products = pgTable('products', {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull(),
    name: text('name').notNull(),
    url: text('url').notNull(),
    description: text('description'),
    createdAt,
    updatedAt,
}, (t) => [
    index('products.clerk_user_id_idx').on(t.clerkUserId)
]);

export const usersRelations = relations(products, ({ one, many }) => ({
    productCustomization: one(productCustomizations),
    productViews: many(productViews),
    countryGroupDiscounts: many(countryGroupDiscounts),
}));

export const productCustomizations = pgTable('product_customizations', {
    id: uuid('id').primaryKey().defaultRandom(),
    classPrefix: text('class_prefix'),
    productId: uuid('product_id').notNull().unique().references(() => products.id, { onDelete: 'cascade' }),
    locationMessage: text('location_message').notNull().default('Hey! It looks like you are from <b>{country}</b>. We support parity purchasing Power, so if you need it, use code <b>"{coupon}"</b> to get <b>{discount}%</b> off.'),
    backgroundColor: text('background_color').notNull().default('hsl(193, 82%, 31%)'),
    textColor: text('text_color').notNull().default('hsl(0, 0%, 100%)'),
    fontSize: text('font_size').notNull().default('1rem'),
    bannerContainer: text('banner_container').notNull().default('body'),
    isSticky: boolean('is_sticky').notNull().default(true),
    createdAt,
    updatedAt,
});

export const productCustomizationsRelations = relations(productCustomizations, ({ one }) => ({
    product: one(products, { fields: [productCustomizations.productId], references: [products.id] }),
}));

export const countryGroups = pgTable('country_groups', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    recommendedDiscountPercentage: real('recommended_discount_percentage'),
    createdAt,
    updatedAt,
});

export const countryGroupsRelations = relations(countryGroups, ({ many }) => ({
    countries: many(countries),
    countryGroupDiscounts: many(countryGroupDiscounts),
}));

export const countries = pgTable('countries', {
    id: uuid('id').primaryKey().defaultRandom(),
    name: text('name').notNull().unique(),
    code: text('code').notNull().unique(),
    countryGroupId: uuid('country_group_id').notNull().references(() => countryGroups.id, { onDelete: 'cascade' }),
    createdAt,
    updatedAt,
});

export const countriesRelations = relations(countries, ({ one, many }) => ({
    countryGroup: one(countryGroups, { fields: [countries.countryGroupId], references: [countryGroups.id] }),
    productViews: many(productViews),
}));

export const productViews = pgTable('product_views', {
    id: uuid('id').primaryKey().defaultRandom(),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    countryId: uuid('country_id').notNull().references(() => countries.id, { onDelete: 'cascade' }),
    visitedAt: timestamp('visited_at', { withTimezone: true }).defaultNow(),
});

export const productViewsRelations = relations(productViews, ({ one }) => ({
    product: one(products, { fields: [productViews.productId], references: [products.id] }),
    country: one(countries, { fields: [productViews.countryId], references: [countries.id] }),
}));

export const countryGroupDiscounts = pgTable('country_group_discounts', {
    countryGroupId: uuid('country_group_id').notNull().references(() => countryGroups.id, { onDelete: 'cascade' }),
    productId: uuid('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    coupon: text('coupon').notNull(),
    discountPercentage: real('discount_percentage').notNull(),
    createdAt,
    updatedAt,
}, (t) => [
    primaryKey({ columns: [t.countryGroupId, t.productId] })
]);

export const countryGroupDiscountsRelations = relations(countryGroupDiscounts, ({ one }) => ({
    countryGroup: one(countryGroups, { fields: [countryGroupDiscounts.countryGroupId], references: [countryGroups.id] }),
    product: one(products, { fields: [countryGroupDiscounts.productId], references: [products.id] }),
}));

export const tierEnum = pgEnum("tiers", Object.keys(subscriptionTires) as [TierNames]);

export const userSubscriptions = pgTable('user_subscriptions', {
    id: uuid('id').primaryKey().defaultRandom(),
    clerkUserId: text('clerk_user_id').notNull().unique(),
    stripeSubscriptionItemId: text('stripe_subscription_item_id'),
    stripeSubscriptionId: text('stripe_subscription_id'),
    stripeCustomerId: text('stripe_customer_id'),
    tier: tierEnum('tier').notNull(),
    createdAt,
    updatedAt,
}, (t) => [
    index('user_subscriptions.clerk_user_id_idx').on(t.clerkUserId),
    index('user_subscriptions.stripe_customer_id_idx').on(t.stripeCustomerId)
]);



