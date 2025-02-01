import { removeTrailingSlash } from "@/lib/utils";
import { z } from "zod";

export const productDetailsSchema = z.object({
    name: z.string().nonempty({
        message: "Product name is required.",
    }),
    url: z.string().nonempty({
        message: "URL is required.",
    }).url({
        message: "Invalid URL.",
    }).transform(removeTrailingSlash),
    description: z.string().optional(),
});

export const productCountryDiscountsSchema = z.object({
    groups: z.array(z.object({
        countryGroupId: z.string().min(1, "Required"),
        discountPercentage: z
            .number()
            .max(100)
            .min(1)
            .or(z.nan())
            .transform(n => isNaN(n) ? undefined : n)
            .optional(),
        coupon: z.string().optional(),
    })
    .refine(
        value => {
            const hasCoupon = !!value.coupon && value.coupon?.length > 0;
            const hasDiscount = !!value.discountPercentage
            return !(hasCoupon && !hasDiscount);
        },
        {
            message: "Coupon requires a discount percentage.",
            path: ["root"],
        }
    )),
});

export const productCustomizationSchema = z.object({
    classPrefix: z.string().optional(),
    backgroundColor: z.string().min(1, "Required"),
    textColor: z.string().min(1, "Required"),
    fontSize: z.string().min(1, "Required"),
    locationMessage: z.string().min(1, "Required"),
    bannerContainer: z.string().min(1, "Required"),
    isSticky: z.boolean(),
});