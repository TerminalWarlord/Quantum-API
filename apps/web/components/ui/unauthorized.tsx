import { IconHandStop } from "@tabler/icons-react";

export default function Unauthorized() {
    return <div className="w-full min-h-44 flex flex-col items-center justify-center space-y-4">
        <IconHandStop size={40} />
        <p>You don't have permission to access this page</p>
    </div>
}