import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function PageWithBackButton({
    href,
    title,
    children,
}: {
    href: string,
    title: string,
    children: React.ReactNode,
}) {
    return (
        <div className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-8">
            <Button variant={"outline"} size={"icon"} className="rounded-full">
                <Link href={href}>
                    <ChevronLeft className="size-8" />
                </Link>
            </Button>
            <h1 className="text-2xl font-semibold self-center">{title}</h1>
            <div className="col-start-2">{children}</div>
        </div>
    );
}