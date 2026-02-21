import { Card } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import { IconAlertTriangle, IconClipboardCheck, IconClipboardCopy, IconCopy, IconCopyCheckFilled, IconKey } from "@tabler/icons-react";
import { Key } from "lucide-react";
import GenerateApiKey from "./generate_api_key";
import { useState } from "react";
import { toast } from "sonner";

type ApiKeyTab = {
    subscriptionId: number
}

export default function ApiKeyTab({ subscriptionId }: ApiKeyTab) {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const copyHandler = async () => {
        if (!apiKey) return;
        try {
            await navigator.clipboard.writeText(apiKey);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
        catch {
            toast.error("Failed to copy");
        }
    }

    const updateKey = (val: string) => {
        setApiKey(val);
    }

    return <TabsContent value="api_key" className="flex flex-col space-y-4 my-2">
        <Card className="gap-0 p-4 lg:p-6">
            <div className="flex flex-col">
                <h3 className="text-base md:text-lg lg:text-xl font-semibold flex space-x-1.5">
                    <Key />
                    <span>API Key Management</span>
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-md lg:text-base">Generate your API key for this subscription (one-time only)</p>
            </div>
            {apiKey ? <div className="my-4">
                <p className="border border-yellow-400 rounded-md flex space-x-3 p-4 justify-center items-center bg-yellow-200/20">
                    <IconAlertTriangle className="w-5 h-5" />
                    <span className="w-4/5 text-sm md:text-md lg:text-base">
                        <span className="font-semibold">Important:</span>
                        <span> This is the only time you'll see this key. Copy it now and store it securely. You cannot retrieve it later.</span>
                    </span>

                </p>
                <div className="flex space-x-3 items-center">
                    <div className="bg-neutral-200 dark:bg-neutral-50/10 my-4 rounded-sm p-3 flex-1">
                        <p className="font-mono text-sm">{apiKey}</p>

                    </div>
                    <div
                        className="border p-3 rounded-sm flex items-center cursor-pointer"
                        onClick={copyHandler}
                    >
                        <div className="relative w-5 h-5">
                            <IconCopy
                                className={`absolute  inset-0 w-5 h-5 transition-all duration-200
        ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}
      `}
                            />

                            <IconClipboardCheck
                                className={`absolute inset-0 w-5 h-5 transition-all duration-200
        ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}
      `}
                            />
                        </div>
                    </div>
                </div>
                <p className="text-neutral-600 dark:text-neutral-300">Use this key in the <span className="font-mono p-1 bg-neutral-200 dark:bg-neutral-50/10 rounded">Authorization</span> header of your API requests.</p>
            </div> : <>
                <div className="flex flex-col items-center justify-center space-y-2 mt-16">
                    <div className="rounded-full w-20 h-20 p-7 bg-cyan-50 dark:bg-cyan-200/20 border border-cyan-100 dark:border-cyan-400/20">
                        <Key className="text-cyan-400" />
                    </div>
                    <h4 className="font-semibold flex space-x-1.5 text-center text-md lg:text-base">Generate Your API Key</h4>
                    <p className="w-4/5 md:w-2/3 lg:w-1/2 text-xs md:text-sm lg:text-base text-neutral-600 dark:text-neutral-400 text-center">You can only generate an API key once. Make sure to copy and store it securely as it won't be shown again.</p>
                </div>
                <div className="mx-auto my-4">
                    <GenerateApiKey updateKey={updateKey} subscriptionId={subscriptionId}/>
                </div>
            </>}


        </Card>
    </TabsContent>
}