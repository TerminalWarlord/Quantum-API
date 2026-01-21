import { Card } from "./card";
import type { Icon } from "@tabler/icons-react";


export default function Dashboard_Card({
    title,
    value,
    icon: Icon
}: {
    title: string,
    value: string,
    icon: Icon;
}) {
    return <Card className="px-5 py-4 flex flex-row gap-1 w-full relative"
    >
        <div>
            <h1 className="text-stone-600 dark:text-stone-300">{title}</h1>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold">{value}</p>
        </div>
        <Icon
            size={25}
            className="absolute top-2 right-2 text-cyan-600 bg-cyan-300/30 p-0.5 rounded-md"
        />
    </Card>
}