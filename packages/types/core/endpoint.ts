export enum EndpointMethod {
    GET = "GET",
    POST = "POST",
    PATCH = "PATCH",
    DELETE = "DELETE",
    PUT = "PUT"
}

export interface Endpoint {
    id: number;
    api_id: number;
    path: string;
    title: string;
    description: string;
    method: EndpointMethod,
    created_at: Date;
    updated_at: Date;
}


