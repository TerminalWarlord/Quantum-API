"use client";

import PageInfo from "@/components/user_dashboard/page_info";

type ManagePageProps = {
    pageId?: number
}

export default function ManagePage({ pageId }: ManagePageProps) {
    return <div>
        <PageInfo
            title={pageId ? "Edit Page" : "Create Page"}
            description={(pageId ? "Edit" : "Write") + " and publish your content"}
        >
        </PageInfo>

    </div>
}