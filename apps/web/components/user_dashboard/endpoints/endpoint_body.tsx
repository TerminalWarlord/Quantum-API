"use client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Parameter } from "@repo/types";
import JsonView from "@uiw/react-json-view";
import { githubLightTheme } from "@uiw/react-json-view/githubLight";
import { monokaiTheme } from "@uiw/react-json-view/monokai";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import EditBody from "./actions/edit_body";
import { isJsonValid } from "@/lib/validate_json";


type EndpointBodyProps = {
    body?: Parameter;
    endpoint_id?: number;
}

export default function EndpointBody({ body, endpoint_id }: EndpointBodyProps) {
    const [value, setValue] = useState("");
    const { theme } = useTheme();

    useEffect(() => {
        if (body) {
            setValue(body.default_value);
        }
    }, [body])

    const jsonTheme = theme === "dark" ? monokaiTheme : githubLightTheme;
    return <div className="flex flex-col space-y-3 my-4">
        <div className="flex justify-between items-center">
            <h3 className="font-medium">Body</h3>
            <EditBody parameter={body} endpoint_id={endpoint_id} />
        </div>
        {value && <div className="p-3 border rounded-md">
            <JsonView
                value={isJsonValid(value) ? JSON.parse(value) : {}}
                style={jsonTheme}
                onChange={(val) => setValue(val as any)}
            />
        </div>}
    </div>
}