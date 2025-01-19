import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { countryGroupDiscounts, productCustomizations, products } from "@/drizzle/schema";
import { BatchItem } from "drizzle-orm/batch";

export function findProducts(userId: string, limit?: number) {
    return db.query.products.findMany({
        where: eq(products.clerkUserId, userId),
        orderBy: [desc(products.createdAt)],
        limit,
    });
}

export function findProduct(id: string, userId: string) {
    return db.query.products.findFirst({
        where: and(eq(products.id, id), eq(products.clerkUserId, userId)),
    });
}

export async function findProductCountryGroups(productId: string, userId: string) {
    const product = await findProduct(productId, userId);
    if (!product) return [];

    const data = await db.query.countryGroups.findMany({
        with: {
            countries: {
                columns: {
                    name: true,
                    code: true,
                }
            },
            countryGroupDiscounts: {
                columns: {
                    coupon: true,
                    discountPercentage: true,
                },
                where: (eq(countryGroupDiscounts.productId, productId)),
                limit: 1,
            }
        }
    });

    return data.map(group => {
        return {
            id: group.id,
            name: group.name,
            recommendedDiscountPercentage: group.recommendedDiscountPercentage,
            countries: group.countries,
            discount: group.countryGroupDiscounts.at(0),
        };
    });
}

export async function createProduct(product: typeof products.$inferInsert) {
    const [newProduct] = await db
        .insert(products)
        .values(product)
        .returning({ id: products.id });

    try {
        await db
            .insert(productCustomizations)
            .values({ productId: newProduct.id })
            .onConflictDoNothing({
                target: productCustomizations.productId
            });
    } catch (error) {
        console.log("Error creating product customizations", error);
        await db.delete(products).where(eq(products.id, newProduct.id));
    }

    return newProduct.id;
}

export async function updateProduct(productId: string, product: Partial<typeof products.$inferInsert>) {
    const { rowCount } = await db
        .update(products)
        .set(product)
        .where(and(eq(products.id, productId), eq(products.clerkUserId, product.clerkUserId!)));

    return rowCount > 0;
}

export async function updateCountryDiscounts(
    deleteGroup: { countryGroupId: string; }[],
    insertGroup: (typeof countryGroupDiscounts.$inferInsert)[],
    productId: string,
    userId: string
) {
    const product = await findProduct(productId, userId);
    if (!product) return false;

    const statements: BatchItem<"pg">[] = [];
    if(deleteGroup.length > 0) {
        statements.push(
            db.delete(countryGroupDiscounts).where(
                and(
                    eq(countryGroupDiscounts.productId, productId),
                    inArray(countryGroupDiscounts.countryGroupId, deleteGroup.map(group => group.countryGroupId))
                )
            )
        );
    }

    if(insertGroup.length > 0) {
        statements.push(
            db.insert(countryGroupDiscounts).values(insertGroup)
            .onConflictDoUpdate({
                target: [
                    countryGroupDiscounts.productId, 
                    countryGroupDiscounts.countryGroupId
                ],
                set: {
                    coupon: sql.raw(`excluded.${countryGroupDiscounts.coupon.name}`),
                    discountPercentage: sql.raw(`excluded.${countryGroupDiscounts.discountPercentage.name}`),
                }
            })
        );
    }

    if(statements.length > 0) {
        await db.batch(statements as [BatchItem<'pg'>]);
    }
}

export async function deleteProduct(id: string, userId: string) {
    const { rowCount } = await db
        .delete(products).where(
            and(eq(products.id, id), eq(products.clerkUserId, userId))
        );
    return rowCount > 0;
}