import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon, CheckIcon } from "lucide-react";
import Image from "next/image";
import { subscriptionTiresInOrder } from "../data/subscriptionTires";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { cn, formatCompactNumber } from "@/lib/utils";

export default function HomePage() {
  return (
    <>
      <section className="min-h-screen 
      bg-[radial-gradient(hsl(0,72%,65%,40%),hsl(24,62%,73%,40%),hsl(var(--background))_60%)]
      flex flex-col gap-8 px-4 items-center justify-center text-center text-balance">

        <h1 className="text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight m-4">
          Price Smarter, Sell bigger!</h1>

        <p className="text-lg lg:text-3xl max-w-screen-xl">
          Optimize your product pricing across countries to maximize sales.
          Capture 85% of the untapped market with location-based dynamic pricing
        </p>

        <SignUpButton>
          <Button
            className="text-lg p-6 rounded-xl flex gap-2"
          >Get started for free <ArrowRightIcon /></Button>
        </SignUpButton>
      </section>
      <section className="bg-primary text-primary-foreground">
        <div className="container py-16 flex flex-col gap-16 px-8 md:px-16">
          <h2 className="text-3xl text-center text-balance">
            Trusted by the top modern companies
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-16">
            <Image src="company-logos/akiflow-logo.svg" alt="akiflow-logo" width={200} height={200} />
            <Image src="/company-logos/amie-logo.svg" alt="amie-logo" width={200} height={200} />
            <Image src="company-logos/draftbit-logo.svg" alt="draftbit-logo" width={200} height={200} />
            <Image src="company-logos/opteo-logo.svg" alt="opteo-logo" width={200} height={200} />
            <Image src="company-logos/tldv-logo.svg" alt="tldv-logo" width={200} height={200} />
          </div>
        </div>
      </section>
      <section id="pricing" className="px-8 py-16 bg-accent/5 scroll-mt-8">
        <h2 className=" text-4xl text-center text-balance font-semibold mb-8">
          Price your product on each market willingness to pay
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-screen-xl mx-auto">
          {
            subscriptionTiresInOrder.map(tier => (
              <PricingCard key={tier.name} {...tier} />
            ))}
        </div>
      </section>
    </>
  );
}

function PricingCard({
  name,
  priceInCents,
  maxNumberOfProducts,
  maxNumberOfVisits,
  canAccessAnalytics,
  canCustomizeBanner,
  canReomveBranding,
}: typeof subscriptionTiresInOrder[number]) {
  const mostPopular = name === "Standard";
  return (
    <Card>
      <CardHeader>
        <div className="text-accent font-semibold mb-8">
          {name}
        </div>
        <CardTitle className="text-xl font-bold">{`$${priceInCents / 100}/mo`}</CardTitle>
        <CardDescription>
          {`${formatCompactNumber(maxNumberOfVisits)} pricing page visits /mo`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignUpButton>
          <Button className="text-lg w-full rounded-lg" variant={mostPopular ? "accent" : "default"}>Get Started</Button>
        </SignUpButton>
      </CardContent>
      <CardFooter className="flex flex-col gap-4 items-start">
        <Feature className="font-bold">
          {`
            ${maxNumberOfProducts} 
            ${maxNumberOfProducts === 1 ? 'product' : 'products'} 
          `}
        </Feature>
        <Feature>
          PPP Discounts
        </Feature>
        {canAccessAnalytics && <Feature>Advance Analytics</Feature>}
        {canReomveBranding && <Feature>Remove Branding</Feature>}
        {canCustomizeBanner && <Feature>Banner Customization</Feature>}
      </CardFooter>
    </Card>
  );
}


function Feature({ children, className }: { children: React.ReactNode, className?: string; }) {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <CheckIcon className="size-4 stroke-accent bg-accent/25 rounded-full p-0.5" />
      <span>{children}</span>
    </div>
  );
}