export enum ApiStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED"
}

export interface Api {
    id: number;
    title: string;
    description: string;
    developer_id?: number;
    developer_name?: string;
    category_name?: string;
    category_slug?: string;
    slug: string;
    review_count?: number;
    rating?: number;
    subscribers?: number;
    category_id?: number;
    product_id?: number;
    thumbnail_url: string;
    base_url?: string;
    status: ApiStatus;
    created_at?: Date;
    updated_at?: Date;
}


export interface Category {
    id?: number;
    slug: string;
    name: string;
}



export interface ApiResult {
    hasNextPage: boolean;
    results: Api[]
}


export type ApiResponse = Pick<Api, "id" | "title" | "description" | "slug" | "thumbnail_url" | "status" | "category_name" | "category_slug"> & { name: string, total_subscribers: number }