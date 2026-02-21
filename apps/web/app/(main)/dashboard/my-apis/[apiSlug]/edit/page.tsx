import AddApiForm from "@/components/user_dashboard/add_api_form";
import { fetchApiDetails } from "@/lib/browse/get_api_details";
import { db, sql } from "@repo/db/client";
import { Api } from "@repo/types";


type PageProps = {
    params: Promise<{ apiSlug: string }>
}
export default async function Page({ params }: PageProps) {
    const apiSlug = (await params).apiSlug;
    const api = await fetchApiDetails(apiSlug);

    return <AddApiForm api={api} />
}