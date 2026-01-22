import { EndpointMethod, ParameterLocation, ParameterType } from "./api_types";


export interface Endpoint {
    id: number;
    api_id: number;
    path: string;
    title: string;
    description: string;
    method: EndpointMethod;
    sample_response?: string;
    created_at: Date;
    updated_at: Date;
}


export interface Parameter {
    id: number;
    endpoint_id: number;
    name: string;
    location: ParameterLocation;
    is_required: boolean;
    default_value: string;
    type: ParameterType;
}


export type EndpointResponse = Pick<Endpoint, "id" | "path" | "title" | "description" | "method">
export type ParameterResponse = Pick<Endpoint, "path" | "title" | "description" | "method" | "sample_response"> & {
    results: Parameter[]
}