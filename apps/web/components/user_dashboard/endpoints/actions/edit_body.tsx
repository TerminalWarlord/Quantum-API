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
import { Endpoint, Parameter, ParameterLocation, ParameterType, Plan } from "@repo/types";
import { IconCheck, IconCircleCheck, IconCircleX, IconCurrencyDollar, IconEdit, IconLoader2 } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EditDialog from "../edit_dialog";

type EditBodyProps = {
    parameter?: Parameter;
    endpoint_id?: number
}

export default function EditBody({
    parameter,
    endpoint_id
}: EditBodyProps) {
    const [body, setBody] = useState("{}")
    const session = useSession();
    const [isValid, setIsValid] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!session) return;
        if (!parameter) return;
        if (isJsonValid(parameter.default_value)) {
            setBody(parameter.default_value);
        }
        else {
            setBody("{}");
        }
        setIsValid(true);
    }, [session, parameter]);


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
            // const formData = new FormData(e.currentTarget);
            // const sample_response = String(formData.get('sample_response'));
            const isValid = isJsonValid(body);
            if (!isValid) {
                throw new Error("Invalid body. Make sure the JSON is valid");
            }
            if (!endpoint_id && !parameter) {
                throw new Error("Invalid request");
            }
            // TODO: delete existing body
            // const { name, is_required, location, type, id: parameter_id } = parameter;
            const reqBody = {
                name: parameter?.name || "",
                is_required: parameter?.is_required || false,
                location: ParameterLocation.BODY as string,
                type: ParameterType.OBJECT as string,
                default_value: body,
                endpoint_id: 0,
                parameter_id: 0,
            }
            if (parameter) {
                reqBody.endpoint_id = parameter.endpoint_id;
                reqBody.parameter_id = parameter.id;

            }
            else if (endpoint_id) {
                reqBody.endpoint_id = endpoint_id;
            }

            console.log(reqBody);
            const api_url = `${BACKEND_URL}/manage/${parameter ? 'update-parameter' : 'create-parameter'}`;
            await submitForm(
                reqBody,
                session.data,
                api_url
            );
            toast.success(`Succefully updated body`);
            window.location.reload();
        }
        catch (err) {
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
        description="Configure the body of the endpoint"
        title="Edit Body"
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        icon={IconEdit}
        submitBtnText="Update"
        submittingBtnText="Updating"
    >
        <Field>
            <FieldLabel htmlFor="features">Body
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Textarea
                    placeholder={`{"name": "Joy"}`}
                    name="body"
                    value={isJsonValid(body) ? JSON.stringify(JSON.parse(body), null, 2) : body}
                    onChange={(e) => {
                        const val = e.target.value;
                        setBody(val)
                        if (isJsonValid(val)) {
                            setIsValid(true);
                        }
                        else {
                            setIsValid(false);
                        }
                    }}
                    required
                />
            </InputGroup>
        </Field>
        {isValid ? <div className="flex space-x-1 items-center text-xs">
            <IconCircleCheck className="w-5 h-5 text-green-500" />
            <span>Valid body</span>
        </div> : <div className="flex space-x-1 items-center text-xs">
            <IconCircleX className="w-5 h-5 text-red-500" />
            <span>Invalid body</span>
        </div>}

    </EditDialog>
}