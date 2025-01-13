import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import Link from "next/link";
import AddToSiteProductModalContent from "./AddToSiteProductModalContent";
import { AlertDialog, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import DeleteProductAlertDialogContent from "./DeleteProductAlertDialogContent";

type Product = {
    id: string;
    name: string;
    url: string;
    description?: string | null;
};

export default function ProductGrid({
    products
}: {
    products: Product[];
}) {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} />
            ))}
        </div>
    );
}

function ProductCard({
    product
}: { product: Product; }) {
    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-2">
                    <CardTitle>
                        <Link href={`/dashboard/products/${product.id}/edit`}>
                            {product.name}
                        </Link>
                        <CardDescription>{product.url}</CardDescription>
                    </CardTitle>
                    <Dialog>
                        <AlertDialog>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant={'outline'} size={"icon"}>
                                        <Ellipsis className="size-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                    <DropdownMenuItem asChild>
                                        <Link href={`/dashboard/products/${product.id}/edit`}>
                                            Edit
                                        </Link>
                                    </DropdownMenuItem>
                                    <DialogTrigger asChild>
                                        <DropdownMenuItem>Add To Site</DropdownMenuItem>
                                    </DialogTrigger>
                                    <DropdownMenuSeparator />
                                    <AlertDialogTrigger asChild>
                                        <DropdownMenuItem>Delete</DropdownMenuItem>
                                    </AlertDialogTrigger>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <DeleteProductAlertDialogContent id={product.id} />
                        </AlertDialog>
                        <AddToSiteProductModalContent id={product.id} />
                    </Dialog>
                </div>
            </CardHeader>
            {product.description && (
                <CardContent>{product.description}</CardContent>
            )}
        </Card>
    );
}
