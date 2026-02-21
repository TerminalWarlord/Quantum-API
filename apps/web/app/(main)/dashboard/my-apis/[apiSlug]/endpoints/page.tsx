import ManageEndpoints from "@/components/user_dashboard/endpoints/manage_endpoints";

export default async function Page({ params }: { params: Promise<{ apiSlug: string }> }) {
    const apiSlug = (await params).apiSlug;
    return <>
        <ManageEndpoints apiSlug={apiSlug} />
    </>
}