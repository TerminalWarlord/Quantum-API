
type PageInfoProps = {
    title: string;
    description?: string;
    children?: React.ReactNode
}

export default function PageInfo({ title, description, children }: PageInfoProps) {
    return <div className="px-4 md:px-8 font-inter my-6">
        <div className="pb-8">
            <h1 className="text-lg md:text-xl lg:text-2xl font-bold">{title}</h1>
            <p className="text-neutral-600 dark:text-neutral-400 tracking-tight">{description}</p>
        </div>
        {children}
    </div>
}