import { and, desc, eq } from "drizzle-orm";
import { db } from "@/drizzle/db";
import { productCustomizations, products } from "@/drizzle/schema";

export function findProducts(clerkUserId: string, limit?: number) {
    return db.query.products.findMany({
        where: eq(products.clerkUserId, clerkUserId),
        orderBy: [desc(products.createdAt)],
        limit,
    });
}

export function findProduct(id: string, clerkUserId: string) {
    return db.query.products.findFirst({
        where: and(eq(products.id, id), eq(products.clerkUserId, clerkUserId)),
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

export async function deleteProduct(id: string, userId: string) {
    const {rowCount } = await db
        .delete(products).where(
            and(eq(products.id, id), eq(products.clerkUserId, userId))
        );
    return rowCount > 0;
}