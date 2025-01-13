'use client';

import { deleteProduct } from "@/actions/products";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useTransition } from "react";

export default function DeleteProductAlertDialogContent({ id }: { id: string; }) {
    const [isDeleting, startDeleting] = useTransition();
    const { toast } = useToast();
    return (
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete this product.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                    startDeleting(async () => {
                        const data = await deleteProduct(id);
                        if (data.message) {
                            toast({
                                title: data.error ? "Error" : "Success",
                                description: data.message,
                                variant: data.error ? "destructive" : "default",
                            });
                        }
                    });

                }} disabled={isDeleting}>Delete</AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}