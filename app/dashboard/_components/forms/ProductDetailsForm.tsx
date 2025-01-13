'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createProduct } from "@/actions/products";
import { productDetailsSchema } from "@/schemas/products";
import { useToast } from "@/hooks/use-toast";

export default function ProductDetailsForm() {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof productDetailsSchema>>({
        resolver: zodResolver(productDetailsSchema),
        defaultValues: {
            name: "",
            url: "https://",
            description: "",
        },
    });

    async function onSubmit(values: z.infer<typeof productDetailsSchema>) {
        const data = await createProduct(values);

        if (data?.message) {
            toast({
                title: data.error ? "Error" : "Success",
                description: data.message,
                variant: data.error ? "destructive" : "default",
            });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Product Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Product Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Enter your website URL</FormLabel>
                                <FormControl>
                                    <Input placeholder="https://your-website" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Include the protocol (http/https) and the full path to the sales page
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Product Description</FormLabel>
                            <FormControl>
                                <Textarea className="min-h-20 resize-none" {...field} />
                            </FormControl>
                            <FormDescription>
                                An optional description to help distinguish your product from others.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="self-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </form>
        </Form>
    );
}