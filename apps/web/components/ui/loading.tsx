import { IconLoader } from "@tabler/icons-react";

export default function Loading() {
    return <div className="w-full min-h-40 flex items-center justify-center">
        <IconLoader className="animate-spin"/>
    </div>
}