import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { BACKEND_URL } from "@/lib/config";
import { submitForm } from "@/lib/user_dashboard/submit_form";
import { IconCurrencyDollar, IconLoader2, IconLoader3, IconPlus } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type CreatePlanProps = {
    apiSlug: string;
}

export default function CreatePlan({ apiSlug }: CreatePlanProps) {
    const session = useSession();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);


    const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (!e.currentTarget) {
                throw new Error("Invalid input");
            }
            if (!session || !session.data?.user.id) {
                throw new Error("You must login to do it!");
            }
            setSubmitting(true);
            // const recommendedSwitch = document.getElementById('is_recommended')
            const formData = new FormData(e.currentTarget);
            formData.append('api_slug', apiSlug);
            const body = {
                name: formData.get('name') as string,
                features: formData.get("features") as string,
                monthly_requests: parseInt(String(formData.get("monthly_requests") ?? "1000"), 10),
                rate_limit: parseInt(String(formData.get("rate_limit") ?? "100"), 10),
                api_slug: apiSlug,
                price_in_cents: parseInt(String(formData.get("price_in_cents") ?? 100), 10),
                is_recommended: formData.get("is_recommended") === "on"
            }

            console.log(body);
            await submitForm(
                body,
                session.data,
                `${BACKEND_URL}/manage/create-api-plan`
            );
            toast.success("Succefully created a new plan");
            router.push('/dashboard/my-apis');
        }
        catch (err) {
            if (err instanceof Error) {
                toast.error(err.message);
            }
            else {
                toast.error("Failed to create plan");
            }
        }
        setSubmitting(false);

    }
    return <div className="my-4 flex items-center justify-end">
        <Dialog>
            <DialogTrigger className="bg-cyan-400 flex items-center justify-center text-white tracking-tight space-x-1 font-medium px-3 py-2 text-sm rounded-md">
                <IconPlus className="w-5 h-5" />
                <span>Create Plan</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Plan</DialogTitle>
                    <DialogDescription>
                        Configure the pricing tier details
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col space-y-3" onSubmit={submitFormHandler}>
                    <Field>
                        <FieldLabel htmlFor="name">Plan Name
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <Input
                                placeholder="eg.: Free/Pro/Enterprise...."
                                name="name"
                                required
                            />
                        </InputGroup>
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="features">Features (one per line)
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <Textarea
                                placeholder={`Feature1\nFeature2\nFeature3....`}
                                name="features"
                                required
                            />
                        </InputGroup>
                    </Field>
                    <div className="grid grid-cols-2 gap-3">
                        <Field>
                            <FieldLabel htmlFor="monthly_requests">Monthly Requests
                                <span className="text-red-600">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <Input
                                    placeholder={`10000...`}
                                    defaultValue={10000}
                                    name="monthly_requests"
                                    type="number"
                                    required
                                />
                            </InputGroup>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="rate_limit">Rate Limit
                                <span className="text-red-600">*</span>
                            </FieldLabel>
                            <InputGroup>
                                <Input
                                    placeholder={`1000....`}
                                    defaultValue={1000}
                                    name="rate_limit"
                                    type="number"
                                    required
                                />
                            </InputGroup>
                        </Field>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="price_in_cents">Price (in cents)
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                placeholder={`100....`}
                                defaultValue={100}
                                name="price_in_cents"
                                type="number"
                                required
                            />
                            <InputGroupAddon>
                                <IconCurrencyDollar />
                            </InputGroupAddon>
                        </InputGroup>

                    </Field>

                    <div className="flex items-center justify-between my-2">
                        <Label htmlFor="is_mandatory">Mark as Recommended</Label>
                        <Switch
                            name="is_recommended"
                            id="is_recommended"
                            className="
                                    data-[state=checked]:bg-cyan-400
                                    dark:data-[state=checked]:bg-cyan-500
                                    data-[state=unchecked]:bg-gray-200
                                    [&>span]:bg-white
                                    dark:[&>span]:data-[state=checked]:bg-cyan-900
                                "
                        />
                    </div>

                    <div className="flex space-x-1 justify-end my-4">
                        <DialogClose asChild>
                            <Button
                                type="button"
                                variant={"secondary"}
                            >
                                Close
                            </Button>
                        </DialogClose>
                        {/* <Button
                            type="submit"
                            className="bg-cyan-400 hover:bg-cyan-400/80 text-white"
                        >
                            Create Plan
                        </Button> */}
                        <Button
                            type="submit"
                            disabled={submitting}
                            className={`bg-cyan-400 hover:bg-cyan-400/80 text-white cursor-pointer ${submitting ? "cursor-not-allowed" : ""}`}
                        >

                            {submitting ? <p className="flex items-center space-x-1">
                                <IconLoader2 className="animate-spin" />
                                <span>Creating</span>
                            </p> : <>Create Plan</>}
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    </div>
}