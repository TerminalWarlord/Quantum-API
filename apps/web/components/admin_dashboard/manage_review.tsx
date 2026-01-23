"use client";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "../ui/button";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";
import { ReviewStatus } from "@repo/types";
import { mutate } from "swr";
import { updateReviewStatus } from "@/lib/admin_dashboard/update_review_status";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

type ManageReviewProps = {
    reviewId: string
    authToken: string
    currentValue: ReviewStatus
}


export default function ManageReview({ reviewId, authToken, currentValue }: ManageReviewProps) {
    const [currentStatus, setCurrentStatus] = useState<ReviewStatus>(currentValue);
    const router = useRouter();
    const path = usePathname();
    const searchParams = useSearchParams();


    const handleUpdate = async () => {
        try {
            const params = new URLSearchParams(searchParams.toString());
            await updateReviewStatus(reviewId, authToken, currentStatus);
            mutate('/admin/dashboard/reviews');
            toast.success("Updated review status to: " + currentStatus);
            router.push(`${path}?${params.toString()}`);
        }
        catch {
            toast.success("Failed to update status!");
        }
    }
    return <div className="flex space-x-1">
        <Select
            value={currentStatus}
            onValueChange={(v) => {
                if (Object.values(ReviewStatus).includes(v as ReviewStatus)) {
                    setCurrentStatus(v as ReviewStatus);
                }
            }}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Status</SelectLabel>
                    <SelectItem value="PENDING">Pending</SelectItem>
                    <SelectItem value="PUBLISHED">Publish</SelectItem>
                    <SelectItem value="DELETED">Delete</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
        <Button
            variant={'outline'}
            onClick={handleUpdate}
        >
            <IconCheck />
        </Button>
    </div>
}