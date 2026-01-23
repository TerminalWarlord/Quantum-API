import { BACKEND_URL } from "@/lib/config";
import { EndpointMethod } from "@repo/types";
import { toast } from "sonner";
import { create } from "zustand";

export enum ResponseTab {
    EXAMPLE = "EXAMPLE",
    API_RESPONSE = "API_RESPONSE",
}

type RequestState = {
    results: string | null;
    error: any;
    loading: boolean;
    body: string | null;
    currentResponseTab: ResponseTab;
    selectedHeaderApiKey: string | null;
    updateResponseTab: (tab: ResponseTab) => void;
    updateBody: (val: string | null) => void;
    updateHeaderApiKey: (val: string) => void;
    sendRequests: (path: string, method: EndpointMethod, token: string) => Promise<void>;
}

export const useRequestStore = create<RequestState>((set, get) => ({
    results: null,
    error: null,
    loading: false,
    body: null,
    currentResponseTab: ResponseTab.EXAMPLE,
    selectedHeaderApiKey: null,
    updateHeaderApiKey: (val: string) => {
        set({ selectedHeaderApiKey: val });
    },
    updateResponseTab: (val) => {
        set({ currentResponseTab: val });
    },
    updateBody: (val: string | null) => {
        set({ body: val });
    },
    sendRequests: async (path, method, token) => {
        set({ loading: true, error: null, currentResponseTab: ResponseTab.API_RESPONSE });
        const api_key = get().selectedHeaderApiKey;
        if (!api_key) {
            set({
                results: null,
                error: "You must have a subscription plan selected from the Headers tab",
                loading: false,
            })
            toast.error("You must have a subscription plan selected from the Headers tab");
            return;
        }
        try {
            const res = await fetch(`${BACKEND_URL}/playground${path}`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: ['GET', 'HEAD'].includes(method) ? undefined : get().body
            });
            const resData = await res.json();
            set({ results: resData, loading: false });
        }
        catch (err) {
            set({
                results: null,
                error: err,
                loading: false,
                currentResponseTab: ResponseTab.API_RESPONSE
            })
        }
    }

}))