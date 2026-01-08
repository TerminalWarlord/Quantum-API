import { AuthForm } from "@/components/auth-form"

export default async function Page({ params }: { params: Promise<{ mode: string }> }) {
  const mode = (await params).mode;
  const authMode = mode === "login" ? "login" : "signup";
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <AuthForm mode={authMode} />
      </div>
    </div>
  )
}
