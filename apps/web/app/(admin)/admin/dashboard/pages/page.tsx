import AllPages from "@/components/admin_dashboard/pages/all_pages";
import PageInfo from "@/components/user_dashboard/page_info";

export default function Page() {
    return <PageInfo
        title="All Pages"
        description="Manage your website pages and content"
    >
        <AllPages />
    </PageInfo>
}