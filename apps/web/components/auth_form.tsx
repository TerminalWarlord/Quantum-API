"use client";

import { Button } from "@/components/ui/button"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card"
import {
	Field,
	FieldDescription,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Spinner } from "./ui/spinner";

export function AuthForm({ mode, ...props }: React.ComponentProps<typeof Card> & { mode: string }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/"
	const [isSubmitted, setIsSubmitted] = useState<boolean>(false);



	async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const inputFields = Object.fromEntries(formData.entries());
		setIsSubmitted(true);
		try {
			if (mode !== "login") {
				if (inputFields.password !== inputFields.confirm_password) {
					toast.error("Password doesn't match!");
					setIsSubmitted(false);
					return;
				}
				const res = await fetch("http://localhost:3003/auth/register", {
					method: "POST",
					body: JSON.stringify(inputFields),
					headers: {
						"Content-Type": "application/json"
					}
				});

				if (!res.ok) {
					const resData = await res.json();
					toast.error(resData.message || "Failed to Sign up");
					setIsSubmitted(false);
					return;
				}
			}

			const successful = await signIn("credentials", {
				callbackUrl,
				email: formData.get("email"),
				password: formData.get("password"),
				redirect: false,
			});
			console.log(successful);
			if (successful?.ok) {
				toast.success("Login Successful");
				setIsSubmitted(false);
				router.push('/');
			}
			else {
				setIsSubmitted(false);
				toast.error(successful?.error);
			}

		}
		catch (err) {
			setIsSubmitted(false);
			toast.error("Something went error!");
		}
	}
	return (
		<Card {...props}>
			<CardHeader>
				<CardTitle>
					{mode === "login" ? "Welcome back" : "Create an account"}

				</CardTitle>
				<CardDescription>
					{mode === "login" ? "Enter your credentials" : "Enter your information below to create your account"}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<form method="POST" onSubmit={onSubmit}>
					<FieldGroup>
						{mode !== "login" && <>
							<Field>
								<FieldLabel htmlFor="first_name">First Name</FieldLabel>
								<Input name="first_name" id="first_name" type="text" placeholder="John" required />
							</Field>
							<Field>
								<FieldLabel htmlFor="last_name">Last Name</FieldLabel>
								<Input name="last_name" id="last_name" type="text" placeholder="Doe" required />
							</Field>
						</>}
						<Field>
							<FieldLabel htmlFor="email">Email</FieldLabel>
							<Input
								name="email"
								id="email"
								type="email"
								placeholder="johndoe@example.com"
								required
							/>
						</Field>
						<Field>
							<FieldLabel htmlFor="password">Password</FieldLabel>
							<Input name="password" id="password" type="password" required />
							<FieldDescription>
								Must be at least 8 characters long.
							</FieldDescription>
						</Field>
						{mode !== "login" &&
							<Field>
								<FieldLabel htmlFor="confirm_password">
									Confirm Password
								</FieldLabel>
								<Input name="confirm_password" id="confirm_password" type="password" required />
								<FieldDescription>Please confirm your password.</FieldDescription>
							</Field>
						}
						<FieldGroup>
							<Field>
								<Button
									disabled={isSubmitted}
									type="submit"
									className="bg-black text-white dark:bg-stone-600"
								>
									{isSubmitted && <Spinner />}
									{mode === "login" ? "Sign in" : "Create Account"}
								</Button>
								<Button
									variant="outline"
									disabled={isSubmitted}
									type="button"
									onClick={() => signIn("google", { callbackUrl })}
								>
									Sign in with Google
								</Button>
								<FieldDescription className="px-6 text-center">
									{mode === "login" ? "Don't have an account?" : "Already have an account?"} <Link href={`/auth/${mode === "login" ? "signup" : "login"}`}>

										{mode === "login" ? "Sign up" : "Sign in"}
									</Link>
								</FieldDescription>
							</Field>
						</FieldGroup>
					</FieldGroup>
				</form>
			</CardContent>
		</Card>
	)
}
