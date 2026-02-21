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
import { Endpoint, EndpointMethod, Parameter, ParameterLocation, ParameterType, Plan } from "@repo/types";
import { IconCheck, IconCircleCheck, IconCircleX, IconCurrencyDollar, IconEdit, IconLoader2, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import EditDialog from "../edit_dialog";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
    NativeSelect,
    NativeSelectOption,
} from "@/components/ui/native-select"


type AddEndpointProps = {
    apiSlug: string
}

export default function AddEndpoint({
    apiSlug
}: AddEndpointProps) {
    const [sampleResponse, setSampleResponse] = useState("")
    // const [location, setLocation] = useState<ParameterLocation | "">("");
    const session = useSession();
    const [isResponseValid, setIsResponseValid] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!session) return;

    }, [session, apiSlug]);


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
            const body = Object.fromEntries(formData.entries());
            console.log(body);
            if (sampleResponse && !isResponseValid) {
                throw new Error("Sample Response is invalid! Make sure it is a valid JSON");
            }
            const reqBody = {
                title: body.title,
                api_slug: apiSlug,
                sample_response: body.sample_response,
                path: body.path,
                description: body.description,
                method: body.method
            }

            console.log(reqBody);
            // return
            await submitForm(
                reqBody,
                session.data,
                `${BACKEND_URL}/manage/create-endpoint`
            );
            toast.success("Succefully added new endpoint");
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
        description="Add a new endpoint to the API"
        title="Add Endpoint"
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        icon={IconPlus}
        submitBtnText="Add"
        submittingBtnText="Adding"
    >
        <Field>
            <FieldLabel htmlFor="features">Title
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Input
                    placeholder={`eg.: Get details...`}
                    name="title"
                    required
                />
            </InputGroup>
        </Field>
        <Field>
            <FieldLabel htmlFor="path">Path
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Input
                    placeholder={`/v1/get-details`}
                    name="path"
                    required
                    className="font-mono"
                />
            </InputGroup>
        </Field>

        <Field>
            <FieldLabel htmlFor="description">Description
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Textarea
                    id="description"
                    placeholder={`Gets details of something`}
                    name="description"
                    // value={defaultValue}
                    // onChange={(e) => {
                    //     const val = e.target.value as ParameterLocation;
                    //     setDefaultValue(val);
                    // }}
                    required
                />
            </InputGroup>
        </Field>

        <Field>
            <FieldLabel htmlFor="sample_response">Sample Response
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Textarea
                    id="sample_response"
                    placeholder={`{"name": "Quantum API"}`}
                    name="sample_response"
                    value={isJsonValid(sampleResponse) ? JSON.stringify(JSON.parse(sampleResponse), null, 2) : sampleResponse}
                    className="font-mono"
                    onChange={(e) => {
                        setSampleResponse(e.target.value);
                        if (isJsonValid(e.target.value)) {
                            setIsResponseValid(true);
                        }
                        else setIsResponseValid(false);
                    }}
                />
            </InputGroup>
        </Field>
        {(isResponseValid || !sampleResponse.length) ? <div className="flex space-x-1 items-center text-xs">
            <IconCircleCheck className="w-5 h-5 text-green-500" />
            <span>Valid</span>
        </div> : <div className="flex space-x-1 items-center text-xs">
            <IconCircleX className="w-5 h-5 text-red-500" />
            <span>Invalid</span>
        </div>}

        <Field>
            <FieldLabel htmlFor="method">Method
                <span className="text-red-600">*</span>
            </FieldLabel>
            <NativeSelect name="method">
                <NativeSelectOption value={EndpointMethod.GET}>GET</NativeSelectOption>
                <NativeSelectOption value={EndpointMethod.POST}>POST</NativeSelectOption>
                <NativeSelectOption value={EndpointMethod.PATCH}>PATCH</NativeSelectOption>
                <NativeSelectOption value={EndpointMethod.PUT}>PUT</NativeSelectOption>
            </NativeSelect>
        </Field>


    </EditDialog>
}