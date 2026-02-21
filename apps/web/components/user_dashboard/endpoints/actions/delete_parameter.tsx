import { IconTrash } from "@tabler/icons-react";
import EditDialog from "../edit_dialog";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/config";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";

type DeleteParameterProps = {
    parameter_id?: number
}
export function DeleteParameter({ parameter_id }: DeleteParameterProps) {
    const [submitting, setSubmitting] = useState(false);
    const session = useSession();
    const searchParams = useSearchParams();
    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (!e.currentTarget) {
                throw new Error("Invalid input");
            }
            if (!session || !session.data?.user.id) {
                throw new Error("You must login to do it!");
            }
            if (!parameter_id) {
                throw new Error("Invalid request");
            }
            await submitForm(
                {},
                session.data,
                `${BACKEND_URL}/manage/delete/parameter/${parameter_id}`,
                "DELETE"
            );
            toast.success(`Succefully deleted parameter`);
            window.location.reload();
        }
        catch (err) {
            console.log(err)
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to delete parameter");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        description=""
        title="Delete"
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        icon={IconTrash}
        triggerClassname="text-red-400 bg-transparent"
        submitBtnText="Delete"
        submittingBtnText="Deleting"
        submitBtnClassname="bg-red-500 hover:bg-red-500/80"
        showBtnText={false}
    >
        <p>
            Are you sure you want to delete this parameter?
        </p>
    </EditDialog>
}