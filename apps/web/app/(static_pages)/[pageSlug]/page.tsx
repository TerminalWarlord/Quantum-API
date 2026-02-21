

type PageProps = {
    params: Promise<{
        pageSlug: string
    }>
}

export default async function Page({ params }: PageProps) {
    const pageSlug = (await params).pageSlug;
    return <>
        {pageSlug}
    </>
}