import { db } from "@/drizzle/db";
import { products, productViews } from "@/drizzle/schema";
import { and, count, eq, gte } from "drizzle-orm";

export async function getProductViewCount(userId: string, startDate: Date) {
    const counts = await db
        .select({ productViewCount: count() })
        .from(productViews)
        .innerJoin(products, eq(products.id, productViews.productId))
        .where(
            and(
                eq(products.clerkUserId, userId),
                gte(productViews.visitedAt, startDate)
            )
        );

    return counts[0]?.productViewCount ?? 0;
}