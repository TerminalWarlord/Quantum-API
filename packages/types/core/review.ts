export enum ReviewStatus {
    PENDING = "PENDING",
    PUBLISHED = "PUBLISHED",
    DELETED = "DELETED",
}

export interface Review {
    id: number,
    content: string,
    api_id: number,
    reviewer_id: number,
    rating: number,
    status: ReviewStatus,
    created_at?: Date
}