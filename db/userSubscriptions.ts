import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { products, userSubscriptions } from "@/drizzle/schema";
import { subscriptionTires } from "@/data/subscriptionTires";

export function createUserSubscription(data: typeof userSubscriptions.$inferInsert) {
    console.log('User creating:', data.clerkUserId);
    return db.insert(userSubscriptions).values(data).
        onConflictDoNothing({
            target: userSubscriptions.clerkUserId,
        });
}

export function deleteUserSubscription(id: string) {
    console.log('User deleting:', id);
    return db.batch([
        db.delete(userSubscriptions).where(eq(userSubscriptions.clerkUserId, id)),
        db.delete(products).where(eq(products.clerkUserId, id)),
    ]);
}

export async function getUserSubscription(userId: string) {
    return await db.query.userSubscriptions.findFirst({
        where: eq(userSubscriptions.clerkUserId, userId),
    });
}

export async function findUserSubscriptionTier(userId: string) {
    const subscription = await getUserSubscription(userId); 

    if (subscription) {
        return subscriptionTires[subscription.tier];
    }

    throw new Error('User subscription not found');
}