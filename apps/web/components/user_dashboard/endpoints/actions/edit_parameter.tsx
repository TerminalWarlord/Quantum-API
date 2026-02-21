import { IconEdit, IconTrash } from "@tabler/icons-react";
import EditDialog from "../edit_dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Parameter, ParameterLocation, ParameterType } from "@repo/types";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { NativeSelect, NativeSelectOption } from "@/components/ui/native-select";
import { toast } from "sonner";
import { BACKEND_URL } from "@/lib/config";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { useSession } from "next-auth/react";
import { FormEvent, useState } from "react";

type EditParameterProps = {
    parameter: Parameter
}

export function EditParameter(
    {
        parameter
    }: EditParameterProps
) {

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
            const { id: parameter_id } = parameter;
            const reqBody = {
                ...body,
                parameter_id,
                location: ParameterLocation.QUERY as string,
                is_required: body.is_required === "on",
            }

            console.log(reqBody);
            await submitForm(
                reqBody,
                session.data,
                `${BACKEND_URL}/manage/update-parameter`
            );
            toast.success("Succefully updated parameter");
            window.location.reload();
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to update parameter");
            }
        }
        setSubmitting(false);
    }
    return <EditDialog
        description="Edit Parameter"
        title="Edit"
        submitFormHandler={submitFormHandler}
        submitting={submitting}
        triggerClassname="bg-transparent text-black"
        icon={IconEdit}
        showBtnText={false}

    >
        <Field>
            <FieldLabel htmlFor="name">Name
                <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="name" name="name" defaultValue={parameter.name} />

        </Field>
        <Field>
            <FieldLabel htmlFor="type">Type
                <span className="text-red-600">*</span>
            </FieldLabel>
            <NativeSelect
                defaultValue={parameter.type}
                name="type"
            >
                <NativeSelectOption value={ParameterType.STRING}>{ParameterType.STRING}</NativeSelectOption>
                <NativeSelectOption value={ParameterType.BOOLEAN}>{ParameterType.BOOLEAN}</NativeSelectOption>
                <NativeSelectOption value={ParameterType.NUMBER}>{ParameterType.NUMBER}</NativeSelectOption>
            </NativeSelect>
        </Field>
        <Field>
            <FieldLabel htmlFor="default_value">Default Value
                <span className="text-red-600">*</span>
            </FieldLabel>
            <Input id="default_value" name="default_value" defaultValue={parameter.default_value} />

        </Field>
        <div className="flex items-center justify-between my-2">
            <Label htmlFor="is_mandatory">Is Required?</Label>
            <Switch
                name="is_required"
                id="is_required"
                defaultChecked={parameter.is_required}
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