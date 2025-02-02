'use server';

import { z } from "zod";
import { productCountryDiscountsSchema, productCustomizationSchema, productDetailsSchema } from "@/schemas/products";
import { auth } from "@clerk/nextjs/server";
import {
    createProduct as createProductDb,
    deleteProduct as deleteProductDb,
    updateProduct as updateProductDB,
    updateCountryDiscounts as updateCountryDiscountsDb,
    updateProductCustomization as updateProductCustomizationDb
} from "@/db/products";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { canCreateProduct, canCustomizeBanner } from "@/permissions";
import { error } from "console";

export async function createProduct(productDetails: z.infer<typeof productDetailsSchema>)
    : Promise<{ error: boolean, message: string; } | undefined> {
    await auth.protect();
    const { userId } = await auth();
    const { success, data } = productDetailsSchema.safeParse(productDetails);
    const canCreate = await canCreateProduct(userId);

    if (!success || !userId || !canCreate) {
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

export async function updateCountryDiscounts(productId: string, countryDiscounts: z.infer<typeof productCountryDiscountsSchema>) {
    await auth.protect();
    const { userId } = await auth();
    const { success, data } = productCountryDiscountsSchema.safeParse(countryDiscounts);
    const errorMessage = "An error occurred while updating your country discounts.";

    if (!success || !userId) {
        return { error: true, message: errorMessage };
    }

    const insert: {
        countryGroupId: string;
        productId: string;
        coupon: string;
        discountPercentage: number;
    }[] = [];
    const deleteIds: { countryGroupId: string; }[] = [];

    data.groups.forEach(group => {
        if (
            group.coupon != null &&
            group.coupon.length > 0 &&
            group.discountPercentage != null &&
            group.discountPercentage > 0
        ) {
            insert.push({
                countryGroupId: group.countryGroupId,
                coupon: group.coupon,
                productId,
                discountPercentage: group.discountPercentage / 100
            });
        } else {
            deleteIds.push({ countryGroupId: group.countryGroupId });
        }
    });

    await updateCountryDiscountsDb(deleteIds, insert, productId, userId);

    return { error: false, message: "Country discounts updated successfully." };
}

export async function updateProductCustomization(id: string, customizationDetails: z.infer<typeof productCustomizationSchema>) {
    await auth.protect();
    const { userId } = await auth();
    const { success, data } = productCustomizationSchema.safeParse(customizationDetails);
    const canCustomize = await canCustomizeBanner(userId!);

    if(!success || userId == null || !canCustomize) {
        return {
            error: true,
            message: "These was an error updating your banner."
        }
    }

    await updateProductCustomizationDb(id, userId, data);

    revalidatePath('/dashboard');

    return {error: false, message: "Banner updated"}
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