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
import { Plan } from "@repo/types";
import { IconCurrencyDollar, IconEdit, IconLoader2 } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

type EditPlanProps = {
    plan: Plan
}

export default function EditPlan({ plan }: EditPlanProps) {
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
            const body = {
                plan_id: plan.id,
                name: formData.get('name') as string,
                features: formData.get("features") as string,
                monthly_requests: parseInt(String(formData.get("monthly_requests") ?? "1000"), 10),
                rate_limit: parseInt(String(formData.get("rate_limit") ?? "100"), 10),
                api_id: plan.api_id,
                price_in_cents: parseInt(String(formData.get("price_in_cents") ?? 100), 10),
                is_recommended: formData.get("is_recommended") === "on"
            }

            console.log(body);
            await submitForm(
                body,
                session.data,
                `${BACKEND_URL}/manage/update-plan`
            );
            toast.success("Succefully updated the plan");
            window.location.reload();
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
    return <div className="my-4 flex w-full">
        <Dialog>
            <DialogTrigger className="bg-black dark:bg-neutral-600 flex items-center justify-center text-white tracking-tight space-x-1 font-medium px-3 py-2 text-sm rounded-md w-full">
                <IconEdit className="w-5 h-5" />
                <span>Edit Plan</span>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Plan</DialogTitle>
                    <DialogDescription>
                        Configure the pricing tier details
                    </DialogDescription>
                </DialogHeader>
                <form className="flex flex-col space-y-3" onSubmit={submitFormHandler}>
                    <input hidden value={plan.api_id} />
                    <Field>
                        <FieldLabel htmlFor="name">Plan Name
                            <span className="text-red-600">*</span>
                        </FieldLabel>
                        <InputGroup>
                            <Input
                                placeholder="eg.: Free/Pro/Enterprise...."
                                name="name"
                                defaultValue={plan.name}
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
                                defaultValue={plan.features}
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
                                    defaultValue={plan.monthly_requests}
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
                                    defaultValue={plan.rate_limit}
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
                                defaultValue={plan.price_in_cents}
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
                            defaultChecked={plan.is_recommended}
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
                        <Button
                            type="submit"
                            disabled={submitting}
                            className={`bg-cyan-400 hover:bg-cyan-400/80 text-white cursor-pointer ${submitting ? "cursor-not-allowed" : ""}`}
                        >

                            {submitting ? <p className="flex items-center space-x-1">
                                <IconLoader2 className="animate-spin" />
                                <span>Submitting</span>
                            </p> : <>Update Plan</>}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    </div>
}