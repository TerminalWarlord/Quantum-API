"use client";

import { mutate } from "swr";
import { useState } from "react";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { IconTrash } from "@tabler/icons-react";
import { deleteUserFetcher } from "@/lib/admin_dashboard/delete_user";
import { useRouter } from "next/navigation";

type RemoveUserProps = {
    userId: string;
    authToken: string;
};

export default function RemoveUser({ userId, authToken }: RemoveUserProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    return (
        <Dialog>
            <DialogTrigger className="bg-red-500 rounded-md text-white px-2 flex space-x-2 py-1 my-4 items-center">
                <IconTrash size={18} />
                <span className="text-sm tracking-tighter">Delete User</span>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will remove the user permanently.
                    </DialogDescription>
                </DialogHeader>

                <DialogFooter>
                    <DialogClose asChild disabled={isDeleting}>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>

                    <Button
                        className="bg-red-500 hover:bg-red-500/90"
                        disabled={isDeleting}
                        onClick={async () => {
                            try {
                                setIsDeleting(true);
                                await deleteUserFetcher(userId, authToken);
                                mutate("/admin/dashboard/users");
                                router.push("/admin/dashboard/users");
                            } finally {
                                setIsDeleting(false);
                            }
                        }}
                    >
                        {isDeleting ? "Deleting..." : "Yes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}