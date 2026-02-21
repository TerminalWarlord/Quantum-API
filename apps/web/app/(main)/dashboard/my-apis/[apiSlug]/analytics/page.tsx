import ApiAnalytics from "@/components/pages/api_analytics";


type PageProps = {
    params: Promise<{ apiSlug: string }>
}
export default async function Page({ params }: PageProps) {
    const apiSlug = (await params).apiSlug;
    return <div className="px-8">
        <ApiAnalytics
            apiSlug={apiSlug}
        />
    </div>
}