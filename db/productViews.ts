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

export async function createProductView({
    productId,
    countryId,
}: {
    productId: string;
    countryId?: string;
}) {
    const [newRow] = await db
        .insert(productViews)
        .values({
            productId: productId,
            visitedAt: new Date(),
            countryId: countryId || 'unknown',
        })
        .returning({ id: productViews.id });
}