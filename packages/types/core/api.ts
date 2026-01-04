export enum ApiStatus {
    ENABLED = "ENABLED",
    DISABLED = "DISABLED"
}

export interface Api {
    id: number,
    title: string,
    description: string,
    developer_id: number,
    slug: string,
    category_id: number,
    product_id: number,
    thumbnail_url: string,
    base_url: string,
    status: ApiStatus,
    created_at: Date,
    updated_at: Date
}