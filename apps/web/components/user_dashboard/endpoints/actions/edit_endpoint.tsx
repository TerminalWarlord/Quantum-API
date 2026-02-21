import { IconEdit, IconEditCircle } from "@tabler/icons-react";
import EditDialog from "../edit_dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Endpoint } from "@repo/types";
import { Textarea } from "@/components/ui/textarea";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { BACKEND_URL } from "@/lib/config";
import { toast } from "sonner";
import { FormEvent, useState } from "react";
import { useSession } from "next-auth/react";

type EditEndpointProps = {
    endpoint: Endpoint
}
export default function EditEndpoint({
    endpoint
}: EditEndpointProps) {
    const session = useSession();
    const [submitting, setSubmitting] = useState(false);


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
            const formData = new FormData(e.currentTarget);
            const body = Object.fromEntries(formData.entries());
            const { description, path, title, sample_response, id: endpoint_id } = endpoint;
            const reqBody = {
                endpoint_id,
                description: body.description || description,
                method: endpoint.method as string,
                path: body.path || path,
                title: body.title || title,
                sample_response: sample_response
            }

            console.log(body);
            await submitForm(
                reqBody,
                session.data,
                `${BACKEND_URL}/manage/update-endpoint`
            );
            toast.success("Succefully updated sample response");
            window.location.reload();
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to update response");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        description="Edit Endpoint"
        title="Edit"
        submitting={false}
        submitFormHandler={submitFormHandler}
        icon={IconEdit}
        triggerClassname="bg-transparent text-black"
        showBtnText={false}
    >
        <Field>
            <FieldLabel htmlFor="title">Title
                <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="title" name="title" defaultValue={endpoint.title} />

        </Field>
        <Field>
            <FieldLabel htmlFor="path">Path
                <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="path" name="path" defaultValue={endpoint.path} className="font-mono" />
        </Field>
        <Field>
            <FieldLabel htmlFor="description">Description
                <span className="text-red-600">*</span>
            </FieldLabel>
            <Textarea id="description" name="description" defaultValue={endpoint.description} className="font-mono" />
        </Field>
    </EditDialog>
}