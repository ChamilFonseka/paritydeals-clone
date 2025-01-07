import { Button } from "@/components/ui/button";
import { SignUpButton } from "@clerk/nextjs";
import { ArrowRightIcon } from "lucide-react";

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
    </>
  );
}
