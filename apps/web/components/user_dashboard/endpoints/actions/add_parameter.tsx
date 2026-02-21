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


type AddParameterProps = {
    endpoint?: Endpoint
}

export default function AddParameter({
    endpoint
}: AddParameterProps) {
    const [defaultValue, setDefaultValue] = useState("")
    // const [location, setLocation] = useState<ParameterLocation | "">("");
    const session = useSession();
    const [isValid, setIsValid] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (!session) return;

    }, [session, endpoint]);


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
            console.log(endpoint)
            if (!endpoint) {
                throw new Error("Invalid endpoint");
            }
            const formData = new FormData(e.currentTarget);
            const body = Object.fromEntries(formData.entries());
            console.log(body);
            // const sample_response = String(formData.get('sample_response'));
            // const isValid = isJsonValid(body);
            // if (!isValid) {
            //     throw new Error("Invalid body. Make sure the JSON is valid");
            // }
            const { id: endpoint_id } = endpoint;
            const reqBody = {
                name: body.name,
                endpoint_id,
                location: ParameterLocation.QUERY as string,
                type: ParameterType.STRING as string,
                default_value: body.default_value,
                is_required: !!body.is_required
            }

            console.log(reqBody);
            await submitForm(
                reqBody,
                session.data,
                `${BACKEND_URL}/manage/create-parameter`
            );
            toast.success("Succefully added new query parameter");
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
        description="Add parameter to the endpoint"
        title="Add Parameter"
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
                    placeholder={`limit`}
                    name="name"
                    required
                />
            </InputGroup>
        </Field>

        <Field>
            <FieldLabel htmlFor="default_value">Default Value
                <span className="text-red-600">*</span>
            </FieldLabel>
            <InputGroup>
                <Textarea
                    id="default_value"
                    placeholder={`10`}
                    name="default_value"
                    value={defaultValue}
                    onChange={(e) => {
                        const val = e.target.value as ParameterLocation;
                        setDefaultValue(val);
                    }}
                    required
                />
            </InputGroup>
        </Field>
        {/* <Field>
            <FieldLabel htmlFor="type">Type
                <span className="text-red-600">*</span>
            </FieldLabel>
            <NativeSelect name="type">
                <NativeSelectOption value="">Select status</NativeSelectOption>
                <NativeSelectOption value={ParameterType.STRING}>Todo</NativeSelectOption>
                <NativeSelectOption value="in-progress">In Progress</NativeSelectOption>
                <NativeSelectOption value="done">Done</NativeSelectOption>
                <NativeSelectOption value="cancelled">Cancelled</NativeSelectOption>
            </NativeSelect>
        </Field> */}
        {/* {(isValid) ? <div className="flex space-x-1 items-center text-xs">
            <IconCircleCheck className="w-5 h-5 text-green-500" />
            <span>Valid</span>
        </div> : <div className="flex space-x-1 items-center text-xs">
            <IconCircleX className="w-5 h-5 text-red-500" />
            <span>Invalid</span>
        </div>} */}

        <div className="flex items-center justify-between my-2">
            <Label htmlFor="is_mandatory">Is Required?</Label>
            <Switch
                name="is_required"
                id="is_required"
                className="
                                    data-[state=checked]:bg-cyan-400
                                    dark:data-[state=checked]:bg-cyan-500
                                    data-[state=unchecked]:bg-gray-200
                                    [&>span]:bg-white
                                    dark:[&>span]:data-[state=checked]:bg-cyan-900
                                "
            />
        </div>

    </EditDialog>
}