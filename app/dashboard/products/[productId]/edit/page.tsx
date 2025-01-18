import ProductDetailsForm from "@/app/dashboard/_components/forms/ProductDetailsForm";
import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findProduct } from "@/db/products";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function ProductEditPage({
    params,
    searchParams,
}: {
    params: Promise<{ productId: string; }>;
    searchParams: Promise<{ tab: string; }>;
}) {
    await auth.protect();
    const { userId } = await auth();
    const { productId } = await params;
    const { tab = 'details' } = await searchParams;

    const product = await findProduct(productId, userId!);
    if (!product) {
        return notFound();
    }
    return (
        <PageWithBackButton title="Edit Product" href="/dashboard/products">
            <Tabs defaultValue={tab}>
                <TabsList className="bg-background/60">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="country">Country</TabsTrigger>
                    <TabsTrigger value="customization">Customization</TabsTrigger>
                </TabsList>
                <TabsContent value="details">
                    <DetailsTab product={product} />
                </TabsContent>
                <TabsContent value="country">Countries.</TabsContent>
                <TabsContent value="customization">Settings.</TabsContent>
            </Tabs>
        </PageWithBackButton>
    );
}

function DetailsTab({
    product
}: {
    product: {
        id: string;
        name: string;
        url: string;
        description: string | null;
    };
}) {
    return <Card>
        <CardHeader>
            <CardTitle className="text-xl">Product Details</CardTitle>
        </CardHeader>
        <CardContent>
            <ProductDetailsForm product={product} />
        </CardContent>
    </Card>;
}