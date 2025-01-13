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