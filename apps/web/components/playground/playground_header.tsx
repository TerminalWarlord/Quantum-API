import { useEffect, useState } from "react"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { usePathname, useSearchParams } from "next/navigation";
import { getSubscriptions } from "@/actions/playground";
import { useRequestStore } from "@/stores/request_store";


type Subscription = {
    id: number;
    name: string;
}

export default function PlaygroundHeader() {
    const path = usePathname();
    const api_slug = path.split('/')[2];
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const selectedHeaderApiKey = useRequestStore(s => s.selectedHeaderApiKey);
    const updateHeaderApiKey = useRequestStore(s => s.updateHeaderApiKey);

    useEffect(() => {
        const addSubscriptions = async () => {
            if (!api_slug) return;
            const data = await getSubscriptions(api_slug)
            setSubscriptions(data as unknown as Subscription[]);
        }
        addSubscriptions();
    }, [api_slug])
    return <div>
        <Select
            disabled={!subscriptions.length}
            onValueChange={(val) => updateHeaderApiKey(val)}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a subscription" />
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Subcriptions</SelectLabel>
                    {subscriptions.length > 0 && subscriptions.map(sub => {
                        return <SelectItem value={sub.id.toString()}>{sub.name}</SelectItem>
                    })}
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
}