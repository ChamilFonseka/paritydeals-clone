import CountryDiscountsForm from "@/app/dashboard/_components/forms/CountryDiscountsForm";
import { ProductCustomizationForm } from "@/app/dashboard/_components/forms/ProductCustomizationForm";
import ProductDetailsForm from "@/app/dashboard/_components/forms/ProductDetailsForm";
import PageWithBackButton from "@/app/dashboard/_components/PageWithBackButton";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { findProduct, findProductCountryGroups, findProductCustomization } from "@/db/products";
import { canCustomizeBanner, canRemoveBranding } from "@/permissions";
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
                <TabsContent value="country">
                    <CountryTab productId={productId} userId={userId!} />
                </TabsContent>
                <TabsContent value="customization">
                    <CustomizationsTab productId={productId} userId={userId!} />
                </TabsContent>
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

async function CountryTab({
    productId,
    userId
}: {
    productId: string;
    userId: string;
}) {
    const countryGroups = await findProductCountryGroups(productId, userId);
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Country Discounts</CardTitle>
                <CardDescription>
                    Leave the discount field blank if you want to display deals for any specific parity group
                </CardDescription>
            </CardHeader>
            <CardContent>
                <CountryDiscountsForm
                    productId={productId}
                    countryGroups={countryGroups}
                />
            </CardContent>
        </Card>
    );
}

async function CustomizationsTab({
    productId,
    userId,
}: {
    productId: string;
    userId: string;
}) {
    const customization = await findProductCustomization(productId, userId);

    if (!customization) return notFound();

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-xl">Banner Customization</CardTitle>
            </CardHeader>
            <CardContent>
                <ProductCustomizationForm
                    canRemoveBranding={await canRemoveBranding(userId)}
                    canCustomizeBanner={await canCustomizeBanner(userId)}
                    customization={customization}
                />
            </CardContent>
        </Card>
    );
}