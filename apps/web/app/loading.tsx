import { Loader2 } from "lucide-react";

export default function Loading() {
    return <div className="w-screen h-screen z-100000 flex items-center justify-center">
        <Loader2 className="animate-spin" />
    </div>
}