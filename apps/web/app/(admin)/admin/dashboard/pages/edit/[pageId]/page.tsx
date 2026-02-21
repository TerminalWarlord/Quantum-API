import ManagePage from "@/components/admin_dashboard/pages/manage_page";

type PageProps = {
    params: Promise<{ pageId: number }>
}
export default async function Page({ params }: PageProps) {
    const pageId = (await params).pageId;
    return <ManagePage pageId={pageId} />
}