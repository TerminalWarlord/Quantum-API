import { useRequestStore } from "@/stores/request_store";
import { Parameter, ParameterLocation } from "@repo/types";
import { IconCircleCheckFilled, IconCircleXFilled } from "@tabler/icons-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";


const checkJsonValidity = (value: string) => {
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
}

export default function PlaygroundBody({ data }: { data: Parameter[] }) {
    // const [bodyInput, setBodyInput] = useState<string | null>(null);
    const bodyInput = useRequestStore(s => s.body);
    const [isJsonValid, setIsJsonValid] = useState(true);
    const searchParams = useSearchParams();
    const updateBody = useRequestStore(s => s.updateBody);
    const endpointId = searchParams.get('endpoint_id');

    const body = data.filter(p => p.location === ParameterLocation.BODY) ?? [];

    useEffect(() => {
        updateBody(null);
        setIsJsonValid(true);
    }, [endpointId]);

    useEffect(() => {
        if (!bodyInput && body.length > 0) {
            try {
                const formatted = JSON.stringify(
                    JSON.parse(body[0].default_value),
                    null,
                    2
                );
                setIsJsonValid(checkJsonValidity(formatted));
                updateBody(formatted);
            } catch {
                setIsJsonValid(checkJsonValidity(body[0].default_value));
                updateBody(body[0].default_value);
            }
        }
    }, [body, bodyInput]);
    return (
        <div className="relative">
            <div className="bg-muted/50 rounded-lg border overflow-hidden">
                <div className="flex">
                    <div className="w-10 py-3 text-right pr-3 text-xs text-muted-foreground font-mono select-none border-r bg-muted/30">
                        {(bodyInput ?? "{\n  \n}")
                            .split("\n")
                            .map((_, i) => (
                                <div key={i}>{i + 1}</div>
                            ))}
                    </div>

                    <textarea
                        value={bodyInput ?? "{\n  \n}"}
                        onChange={(e) => {
                            updateBody(e.target.value);
                            setIsJsonValid(checkJsonValidity(e.target.value));
                        }}
                        className="
                        flex-1
                        bg-transparent
                        p-3
                        font-mono
                        text-sm
                        resize-none
                        focus:outline-none
                        min-h-50
                        whitespace-pre
                        leading-relaxed
                        "
                        spellCheck={false}
                    />
                </div>
            </div>

            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                {isJsonValid ? <>
                    <IconCircleCheckFilled className="h-5 w-5 text-emerald-500" />
                    Valid Body
                </> : <>
                    <IconCircleXFilled className="h-5 w-5 text-red-500" />
                    Invalid Body
                </>}
            </div>
        </div>
    );
}