import { Api } from "./api"

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

export type ReviewResponse = Pick<Review, "id" | "content" | "api_id" | "created_at" | "rating" | "status"> & Pick<Api, "slug" | "title"> & { name: string, user_id: number, username: string, image: string }