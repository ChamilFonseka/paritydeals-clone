'use server';

import { z } from "zod";
import { productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import { createProduct as createProductDb, deleteProduct as deleteProductDb, updateProduct as updateProductDB } from "@/db/products";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

export async function createProduct(productDetails: z.infer<typeof productDetailsSchema>)
    : Promise<{ error: boolean, message: string; } | undefined> {
    await auth.protect();
    const { userId } = await auth();
    const { success, data } = productDetailsSchema.safeParse(productDetails);

    if (!success || !userId) {
        return { error: true, message: "An error occurred while creating your product." };
    }

    const id = await createProductDb({ ...data, clerkUserId: userId });

    redirect(`/dashboard/products/${id}/edit?tab=countries`);
}

export async function updateProduct(productId: string, productDetails: z.infer<typeof productDetailsSchema>)
    : Promise<{ error: boolean, message: string; } | undefined> {
    await auth.protect();
    const { userId } = await auth();
    const { success, data } = productDetailsSchema.safeParse(productDetails);
    const errorMessage = "An error occurred while updating your product.";

    if (!success || !userId) {
        return { error: true, message: errorMessage };
    }

    const isSuccess = await updateProductDB(productId, { ...data, clerkUserId: userId });

    return { error: !isSuccess, message: isSuccess ? "Product updated successfully." : errorMessage };
}

export async function deleteProduct(id: string) {
    await auth.protect();
    const { userId } = await auth();
    const errorMessage = "An error occurred while deleting your product.";
    if (!userId) {
        return { error: true, message: errorMessage };
    }

    const isSuccess = await deleteProductDb(id, userId);

    revalidatePath('/dashboard');
    
    return { error: !isSuccess, message: isSuccess ? "Product deleted successfully." : errorMessage };
}