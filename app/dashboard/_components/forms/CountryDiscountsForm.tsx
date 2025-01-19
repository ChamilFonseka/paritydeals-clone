'use client';

import { updateCountryDiscounts } from "@/actions/products";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { productCountryDiscountsSchema } from "@/schemas/products";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function CountryDiscountsForm({
    productId,
    countryGroups
}: {
    productId: string;
    countryGroups: {
        id: string;
        name: string;
        recommendedDiscountPercentage: number | null;
        countries: {
            name: string;
            code: string;
        }[];
        discount?: {
            coupon: string;
            discountPercentage: number;
        };
    }[];
}) {
    const { toast } = useToast();
    const form = useForm<z.infer<typeof productCountryDiscountsSchema>>({
        resolver: zodResolver(productCountryDiscountsSchema),
        defaultValues: {
            groups: countryGroups.map(group => {
                const discount = group.discount?.discountPercentage ?? group.recommendedDiscountPercentage;
                return {
                    countryGroupId: group.id,
                    coupon: group.discount?.coupon,
                    discountPercentage: discount != null ? discount * 100 : undefined,
                };
            })
        },
    });

    async function onSubmit(values: z.infer<typeof productCountryDiscountsSchema>) {
        const data = await updateCountryDiscounts(productId, values);

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
                {countryGroups.map((group, index) => (
                    <Card key={group.id}>
                        <CardContent className="pt-6 flex gap-16 items-center">
                            <div>
                                <h2 className="text-muted-foreground text-sm font-semibold mb-2">
                                    {group.name}
                                </h2>
                                <div className="flex gap-2 flex-wrap">
                                    {group.countries.map(country => (
                                        <Image
                                            key={country.code}
                                            src={`http://purecatamphetamine.github.io/country-flag-icons/3x2/${country.code.toUpperCase()}.svg`}
                                            width={24}
                                            height={16}
                                            title={country.name}
                                            alt={country.name}
                                        />
                                    ))}
                                </div>
                            </div>
                            <Input type="hidden" {...form.register(`groups.${index}.countryGroupId`)} />
                            <div className="ml-auto flex-shrink-0 flex gap-2 flex-col w-min">
                                <div className="flex gap-4">
                                    <FormField
                                        control={form.control}
                                        name={`groups.${index}.discountPercentage`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Discount %</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        className="w-24"
                                                        {...field}
                                                        value={field.value ?? ""}
                                                        min={0}
                                                        max={100}
                                                        onChange={e =>
                                                            field.onChange(e.target.valueAsNumber)
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`groups.${index}.coupon`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Coupon</FormLabel>
                                                <FormControl>
                                                    <Input className="w-48" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                                <FormMessage>
                                    {form.formState.errors.groups?.[index]?.root?.message}
                                </FormMessage>
                            </div>
                        </CardContent>
                    </Card>
                ))}
                <div className="self-end">
                    <Button type="submit" disabled={form.formState.isSubmitting}>Save</Button>
                </div>
            </form>
        </Form>
    );
}