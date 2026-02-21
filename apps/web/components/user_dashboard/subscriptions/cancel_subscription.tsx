import { IconCircleX } from "@tabler/icons-react";
import EditDialog from "../endpoints/edit_dialog";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { BACKEND_URL } from "@/lib/config";
import { submitForm } from "@/lib/user_dashboard/submit_form";

type CancelSubscriptionProps = {
    subscription_id: number
}
export default function CancelSubscription({ subscription_id }: CancelSubscriptionProps) {
    const session = useSession();
    const [submitting, setSubmitting] = useState(false);


    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            if (!session || !session.data?.user.id) {
                throw new Error("You must login to do it!");
            }
            await submitForm(
                {},
                session.data,
                `${BACKEND_URL}/manage/subscriptions/cancel/${subscription_id}`,
                "PATCH"
            );
            toast.success("Succefully cancelled subscription");
            // window.location.reload();
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to cancel subscription");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        title="Cancel Subscription"
        description=""
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        icon={IconCircleX}
        submitBtnText="Sure"
        submitBtnClassname="bg-red-500! hover:bg-red-500/80!"
        triggerClassname="bg-red-500! hover:bg-red-500/80!"
    >
        <p className="">Are you sure that you want to cancel your subscription?</p>
    </EditDialog>
}