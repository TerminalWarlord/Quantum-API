import { IconTrash } from "@tabler/icons-react";
import EditDialog from "../edit_dialog";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { BACKEND_URL } from "@/lib/config";
import { useRouter, useSearchParams } from "next/navigation";


type DeleteEndpointProps = {
    endpoint_id: number
}
export default function DeleteEndpoint({ endpoint_id }: DeleteEndpointProps) {
    const [submitting, setSubmitting] = useState(false);
    const session = useSession();
    const router = useRouter();
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
            if (!endpoint_id) {
                throw new Error("Invalid request");
            }
            await submitForm(
                {},
                session.data,
                `${BACKEND_URL}/manage/delete/endpoint/${endpoint_id}`,
                "DELETE"
            );
            // toast.success(`Succefully deleted endpoint`);
            window.location.reload();
        }
        catch (err) {
            console.log(err)
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to update body");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        description=""
        title="Delete"
        submitting={submitting}
        submitFormHandler={submitFormHandler}
        icon={IconTrash}
        triggerClassname="bg-transparent text-red-500"
        showBtnText={false}
        submitBtnText="Delete"
        submittingBtnText="Deleting"
        submitBtnClassname="bg-red-500 hover:bg-red-500/80"

    >
        <p>Are you sure you want to delete the endpoint?</p>
    </EditDialog>
}