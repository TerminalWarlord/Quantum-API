"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../ui/dialog";
import { Button } from "../ui/button";


interface DialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    confirmText: string;
    cancelText?: string;
    variant?: "default" | "destructive";
    onConfirm: () => Promise<void> | void
}

export default function ConfirmDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText,
    cancelText,
    variant,
    onConfirm
}: DialogProps) {
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        try {
            setLoading(true);
            await onConfirm();
            onOpenChange(false);
        }
        finally {
            setLoading(false);
        }
    }

    return <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                {description && (
                    <DialogDescription>{description}</DialogDescription>
                )}
            </DialogHeader>

            <DialogFooter>
                <Button
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                    disabled={loading}
                >
                    {cancelText}
                </Button>

                <Button
                    variant={variant}
                    onClick={handleConfirm}
                    disabled={loading}
                >
                    {loading ? "Processing..." : confirmText}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>

}