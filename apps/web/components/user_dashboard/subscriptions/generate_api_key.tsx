import { IconKey } from "@tabler/icons-react";
import EditDialog from "../endpoints/edit_dialog";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { BACKEND_URL } from "@/lib/config";


type GenerateApiKeyProps = {
    updateKey: (v: string) => void;
    subscriptionId: number;
}
export default function GenerateApiKey({ updateKey, subscriptionId }: GenerateApiKeyProps) {
    const session = useSession();
    const [submitting, setSubmitting] = useState(false);

    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            // setSubmitting(true);
            if (!e.currentTarget) {
                throw new Error("Invalid input");
            }
            if (!session || !session.data?.user.id) {
                throw new Error("You must login to do it!");
            }
            const formData = new FormData(e.currentTarget);

            const body = {
                "subscription_id": subscriptionId
            }

            const { apiKey } = await submitForm(
                body,
                session.data,
                `${BACKEND_URL}/manage/create-api-key`
            );
            toast.success("Succefully generate new API key");
            updateKey(apiKey);
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to generate key");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        title="Generate API Key"
        description=""
        submitting={false}
        icon={IconKey}
        submitFormHandler={submitFormHandler}
        triggerClassname="bg-cyan-400"
        submitBtnClassname="bg-cyan-400"
        submitBtnText="Generate Key"
    >
        <p className="text-neutral-600 dark:text-neutral-400 text-md tracking-tight">This action can only be performed once. The API key will be shown only once after generation. Make sure you're ready to copy and store it securely.</p>

    </EditDialog>
}