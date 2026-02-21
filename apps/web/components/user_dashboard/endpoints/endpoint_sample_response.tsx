import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Endpoint, Parameter } from "@repo/types";
import { IconCode } from "@tabler/icons-react";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { monokaiTheme } from "@uiw/react-json-view/monokai";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import UpdateResponse from "./actions/update_response";


type EndpointSampleResponseProps = {
    endpoint: Endpoint
}

export default function EndpointSampleResponse({ endpoint }: EndpointSampleResponseProps) {
    const [value, setValue] = useState("{}");
    const { theme } = useTheme();

    useEffect(() => {
        if (endpoint) {
            setValue(endpoint.sample_response || "{}");
        }
    }, [endpoint])

    const jsonTheme = theme === "dark" ? monokaiTheme : githubLightTheme;
    return <div className="flex flex-col space-y-3">
        <div className="flex items-center justify-between">
            <h3 className="font-medium">Sample Response</h3>
            {/* <Button>Update Response</Button> */}
            <UpdateResponse endpoint={endpoint} />
        </div>
        {value && <div className="p-3 border rounded-md">
            <JsonView
                value={JSON.parse(value)}
                style={jsonTheme}
                collapsed={1}
                onChange={(val) => setValue(val as any)}

            />
        </div>}
    </div>
}