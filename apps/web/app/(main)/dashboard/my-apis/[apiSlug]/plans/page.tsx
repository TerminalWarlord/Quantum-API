import ManagePlans from "@/components/user_dashboard/plans/manage_plans";

export default async function Page({ params }: { params: Promise<{ apiSlug: string }> }) {
    const apiSlug = (await params).apiSlug;
    return <>
        <ManagePlans apiSlug={apiSlug} />
    </>
}