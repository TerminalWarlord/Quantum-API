import { useState } from "react"
import JsonView from '@uiw/react-json-view';
import { monokaiTheme } from '@uiw/react-json-view/monokai';
import { lightTheme } from '@uiw/react-json-view/light';
import { useTheme } from "next-themes";
import { IconMoodEmptyFilled } from "@tabler/icons-react";
import { ResponseTab, useRequestStore } from "@/stores/request_store";
import { Loader2 } from "lucide-react";



type PlaygroundResponseTabProps = {
    sampleResponse: string | undefined | null;
}


const isValidJson = (value: string) => {
    try {
        JSON.parse(value);
        return true;
    }
    catch {
        return false;
    }
}

export default function PlaygroundResponseTab({
    sampleResponse }: PlaygroundResponseTabProps) {
    const { resolvedTheme } = useTheme();
    const results = useRequestStore(s => s.results);
    const isLoading = useRequestStore(s => s.loading);
    const jsonTheme = resolvedTheme === "dark" ? monokaiTheme : lightTheme;
    const currentTab = useRequestStore(s => s.currentResponseTab);
    const updateTab = useRequestStore(s => s.updateResponseTab);
    return <div className="w-full flex-1 rounded-t-md border box-content overflow-scroll">
        <ul className="flex items-baseline px-0 sm:px-2 md:px-8 text-center text-black dark:text-stone-100 border-b box-border">
            <li>
                <button
                    onClick={() => updateTab(ResponseTab.EXAMPLE)}
                    className={`${currentTab === ResponseTab.EXAMPLE ? "border-cyan-400" : "border-transparent"} px-2 md:px-3 lg:px-4 border-b-4 py-2 transform transition-all duration-150 ease-in cursor-pointer text-sm md:text-md lg:text-base`}
                >Example Response</button>
            </li>

            <li>
                <button
                    onClick={() => updateTab(ResponseTab.API_RESPONSE)}
                    className={`${currentTab === ResponseTab.API_RESPONSE ? "border-cyan-400" : "border-transparent"} px-2 md:px-3 lg:px-4 border-b-4 py-2 transform transition-all duration-150 ease-in cursor-pointer text-sm md:text-md lg:text-base`}
                >Results</button>
            </li>
        </ul>
        <div className="px-4 py-2">
            {currentTab === ResponseTab.EXAMPLE && <>
                {(!!sampleResponse && isValidJson(sampleResponse)) ? < JsonView
                    style={jsonTheme}
                    value={JSON.parse(sampleResponse)}
                    className="bg-amber-50" /> :
                    <div className="flex flex-col items-center justify-center space-y-1 p-2 ">
                        <IconMoodEmptyFilled className="w-10 h-10" />
                        <p>Feels empty</p>
                    </div>}
            </>}

            {currentTab === ResponseTab.API_RESPONSE && <>
                {(!isLoading && !!results && (isValidJson(results) || isValidJson(JSON.stringify(results)))) ? < JsonView
                    style={jsonTheme}
                    collapsed={1}
                    value={results as any}
                    className="bg-amber-50" /> :
                    <div className="flex flex-col items-center justify-center space-y-1 p-2">
                        {isLoading ?
                            <Loader2 className="animate-spin" />
                            : <><IconMoodEmptyFilled className="w-10 h-10" />
                                <p>Feels empty</p></>}
                    </div>}
            </>}
        </div>

    </div>
}