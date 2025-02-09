import { createCancelSession, createCheckoutSession, createCustomerPortalSession } from "@/actions/stripe";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { subscriptionTires, subscriptionTiresInOrder, TierNames } from "@/data/subscriptionTires";
import { getProductCount } from "@/db/products";
import { getProductViewCount } from "@/db/productViews";
import { findUserSubscriptionTier } from "@/db/userSubscriptions";
import { cn, formatCompactNumber } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { startOfMonth } from "date-fns";
import { CheckIcon } from "lucide-react";
import { ReactNode } from "react";

export default async function SubscriptionPage() {
  const { userId, redirectToSignIn } = await auth();
  if (userId == null) return redirectToSignIn();
  const tier = await findUserSubscriptionTier(userId);
  const productCount = await getProductCount(userId);
  const pricingViewCount = await getProductViewCount(userId, startOfMonth(new Date()));

  return (
    <>
      <h1 className="mb-6 text-3xl font-semibold">Your Subscription</h1>
      <div className="flex flex-col gap-8 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Monthly Usage</CardTitle>
              <CardDescription>
                {formatCompactNumber(pricingViewCount)} /{" "}
                {formatCompactNumber(tier.maxNumberOfVisits)} pricing page
                visits this month
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(pricingViewCount / tier.maxNumberOfVisits) * 100}
              />
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Number of Products</CardTitle>
              <CardDescription>
                {productCount} / {tier.maxNumberOfProducts} products created
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Progress
                value={(productCount / tier.maxNumberOfProducts) * 100}
              />
            </CardContent>
          </Card>
        </div>
        {tier != subscriptionTires.Free && (
          <Card>
            <CardHeader>
              <CardTitle>You are currently on the {tier.name} plan</CardTitle>
              <CardDescription>
                If you would like to upgrade, cancel, or change your payment
                method use the button below.
              </CardDescription>
            </CardHeader>
            <CardContent>

              <Button type="submit"
                variant="accent"
                className="text-lg rounded-lg"
                size="lg"
                onClick={createCustomerPortalSession}
              >
                Manage Subscription
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl">
        {subscriptionTiresInOrder.map((t) => (
          <PricingCard key={t.name} currentTierName={tier.name} {...t} />
        ))}
      </div>
    </>
  );
}

function PricingCard({
  name,
  priceInCents,
  maxNumberOfVisits,
  maxNumberOfProducts,
  canReomveBranding,
  canAccessAnalytics,
  canCustomizeBanner,
  currentTierName,
}: (typeof subscriptionTiresInOrder)[number] & { currentTierName: TierNames; }) {
  const isCurrent = currentTierName === name;

  return (
    <Card className="shadow-none rounded-3xl overflow-hidden">
      <CardHeader>
        <div className="text-accent font-semibold mb-8">{name}</div>
        <CardTitle className="text-xl font-bold">
          ${priceInCents / 100} /mo
        </CardTitle>
        <CardDescription>
          {formatCompactNumber(maxNumberOfVisits)} pricing page visits/mo
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Button
          disabled={isCurrent}
          className="text-lg w-full rounded-lg"
          size="lg"
          onClick={
            name === "Free"
              ? createCancelSession
              : createCheckoutSession.bind(null, name)
          }
        >
          {isCurrent ? "Current" : "Swap"}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {maxNumberOfProducts}{" "}
          {maxNumberOfProducts === 1 ? "product" : "products"}
        </Feature>
        <Feature>PPP discounts</Feature>
        {canCustomizeBanner && <Feature>Banner customization</Feature>}
        {canAccessAnalytics && <Feature>Advanced analytics</Feature>}
        {canReomveBranding && <Feature>Remove Easy PPP branding</Feature>}
      </CardFooter>
    </Card>
  );
}

function Feature({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}