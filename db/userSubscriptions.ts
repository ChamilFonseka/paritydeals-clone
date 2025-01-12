import { db } from "@/drizzle/db";
import { eq } from "drizzle-orm";
import { products, userSubscriptions } from "@/drizzle/schema";

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