import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

import { Icon, IconLoader2 } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { FormEvent } from "react";

type EditDialogProps = {
    title: string;
    description: string;
    icon?: Icon;
    submitBtnText?: string;
    submittingBtnText?: string;
    submitting: boolean;
    // toggleSubmitting: (f: boolean) => void;
    submitFormHandler: (e: FormEvent<HTMLFormElement>) => void;
    children: React.ReactNode;
    triggerClassname?: string;
    submitBtnClassname?: string;
    showBtnText?: boolean;
}


export default function EditDialog({
    title,
    description,
    icon: Icon,
    submitting,
    submitBtnText = "Submit",
    submittingBtnText = "Submitting",
    triggerClassname = "",
    submitBtnClassname = "",
    showBtnText = true,
    // toggleSubmitting,
    submitFormHandler,
    children
}: EditDialogProps) {
    return <Dialog>
        <DialogTrigger className={cn(
            "bg-black dark:bg-neutral-600 flex items-center justify-center text-white tracking-tight space-x-1 font-medium px-3 py-2 text-sm rounded-md",
            triggerClassname
        )}>
            {Icon && <Icon className="w-5 h-5" />}
            {showBtnText && <span>{title}</span>}
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>{title}</DialogTitle>
                <DialogDescription>
                    {description}
                </DialogDescription>
            </DialogHeader>
            <form className="flex flex-col space-y-3" onSubmit={submitFormHandler}>
                {children}
                <div className="flex space-x-1 justify-end my-4">
                    <DialogClose asChild>
                        <Button
                            type="button"
                            variant={"secondary"}
                        >
                            Close
                        </Button>
                    </DialogClose>
                    <Button
                        type="submit"
                        disabled={submitting}
                        className={cn(
                            `bg-cyan-400 hover:bg-cyan-400/80 text-white cursor-pointer`,
                            submitBtnClassname
                        )}
                    >
                        {submitting ? <p className="flex items-center space-x-1">
                            <IconLoader2 className="animate-spin" />
                            <span>{submittingBtnText}</span>
                        </p> : <>{submitBtnText}</>}
                    </Button>
                </div>
            </form>
        </DialogContent>
    </Dialog>
}