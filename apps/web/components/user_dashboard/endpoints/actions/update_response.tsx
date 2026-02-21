import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { cn } from "@/lib/utils";
import { isJsonValid } from "@/lib/validate_json";
import { Endpoint, Plan } from "@repo/types";
import { IconCurrencyDollar, IconEdit, IconLoader2 } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import EditDialog from "../edit_dialog";


type UpdateResponseProps = {
    endpoint: Endpoint
}


export default function UpdateResponse({ endpoint }: UpdateResponseProps) {
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
            const sample_response = String(formData.get('sample_response'));
            const isValid = isJsonValid(sample_response);
            if (!isValid) {
                throw new Error("Invalid body. Make sure the JSON is valid");
            }
            const { description, method, path, title, id: endpoint_id } = endpoint;
            const body = {
                endpoint_id,
                description,
                method,
                path,
                title,
                sample_response: sample_response
            }

            console.log(body);
            await submitForm(
                body,
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
        description="Configure the response of the endpoint"
        title="Update Response"
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        icon={IconEdit}
        submitBtnText="Update"
        submittingBtnText="Updating"
    >
        <Field>
            <FieldLabel htmlFor="features">Sample Response
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Textarea
                    placeholder={`{"name": "Joy"}`}
                    name="sample_response"
                    defaultValue={endpoint.sample_response}
                    required
                />
            </InputGroup>
        </Field>
    </EditDialog>
}