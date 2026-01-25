"use client";

import { Card } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import EditAvatar from "@/components/user_dashboard/edit_avatar";
import { BACKEND_URL } from "@/lib/config";
import { useUserStore } from "@/stores/user_store";
import { IconCircleCheckFilled, IconCircleXFilled, IconLoader, IconUser } from "@tabler/icons-react";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { debouncer } from "@/lib/debouncer";
import { submitProfileUpdateForm } from "@/lib/user_dashboard/update_profile";





export default function EditProfile() {
    const session = useSession();
    const userData = useUserStore(s => s.user);
    const usernameInputRef = useRef<HTMLInputElement>(null);
    const updateUserData = useUserStore(s => s.updateData);
    const [isUsernameValid, setIsUsernameValid] = useState<boolean | null>(true);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);


    useEffect(() => {
        if (!session || !session.data?.user.id) return;
        const getUser = async () => {
            const tokenRes = await fetch('/api/token', {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    id: session.data.user.id
                })
            });
            if (!tokenRes.ok) {
                throw new Error("Failed to generate token");
            }
            const { token } = await tokenRes.json();
            const res = await fetch(`${BACKEND_URL}/user/get-me`, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + token
                }
            })
            if (!res.ok) {
                throw new Error("Failed to fetch user data");
            }
            const resData = await res.json();
            updateUserData(resData.results);

        }
        getUser();

    }, [session, updateUserData]);


    const handleUsernameChange = async () => {
        if (!session || !session.data?.user.id) return;
        if (!usernameInputRef.current) return;
        try {
            const tokenRes = await fetch('/api/token', {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    id: session.data.user.id
                })
            });
            setIsUsernameValid(null);
            if (!tokenRes.ok) {
                throw new Error("Failed to generate token");
            }
            const { token } = await tokenRes.json();
            const res = await fetch(`${BACKEND_URL}/user?username=${usernameInputRef.current.value}`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (!res.ok) {
                throw new Error("Failed to check username availability");
            }
            const { success } = await res.json();
            setIsUsernameValid(success);
        }
        catch (err: any) {
            toast.error(err.message || "Failed to check username");
            setIsUsernameValid(false);
        }
    }


    return <div className="px-8 flex flex-col space-y-4">
        <div>
            <h1 className="text-2xl font-bold">Edit Profile</h1>
            <p>Manage your account settings and preferences</p>
        </div>
        <Card className="p-8 gap-0 flex flex-col space-y-4">
            <div>
                <p className="flex space-x-2">
                    <IconUser />
                    <span className="font-bold text-xl">Profile Information</span>
                </p>
                <p className="text-stone-500 text-sm">Update your personal details</p>
            </div>
            <div className="flex space-x-5 items-center">
                <EditAvatar />
                <div>
                    <h3 className="text-lg font-semibold leading-5.5">Joy Biswas</h3>
                    <p className="text-stone-500 tracking-tight text-sm">{userData?.email}</p>
                </div>
            </div>
            <Separator />
            <form className="flex flex-col" onSubmit={async (e) => {
                await submitProfileUpdateForm(
                    e,
                    session.data,
                    (status: boolean) => setIsSubmitting(status)
                )
            }}>
                <div className="grid grid-cols-2 gap-4">
                    <Field className="">
                        <FieldLabel htmlFor="inline-start-input">First Name</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="John"
                                name="first_name"
                                defaultValue={userData?.first_name}
                            />
                        </InputGroup>
                    </Field>
                    <Field className="">
                        <FieldLabel htmlFor="inline-start-input">Last Name</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="Doe"
                                name="last_name"
                                defaultValue={userData?.last_name}
                            />
                        </InputGroup>
                    </Field>
                    <Field className="">
                        <FieldLabel htmlFor="inline-start-input">Username</FieldLabel>
                        <InputGroup>
                            <InputGroupInput
                                id="inline-start-input"
                                placeholder="johndoe"
                                defaultValue={userData?.username}
                                ref={usernameInputRef}
                                name="username"
                                onKeyUp={debouncer(handleUsernameChange, 500)}
                            />
                            {isUsernameValid === null ? <><IconLoader className="px-1 animate-spin" /></> : (
                                isUsernameValid ? <IconCircleCheckFilled className="px-1 text-green-700" /> : <IconCircleXFilled className="h-5 w-5 text-red-500" />
                            )}
                        </InputGroup>
                    </Field>
                </div>
                <Button
                    disabled={isSubmitting}
                    type="submit"
                    className="my-4 cursor-pointer bg-black hover:bg-black/80 dark:bg-stone-700 dark:hover:bg-stone-700/80 text-white"
                >Save</Button>
            </form>
        </Card>
    </div>
}