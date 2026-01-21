
export interface BasicUserInfo {
    total_subscriptions: number,
    total_spent: number,
    api_published: number
}

export interface Subscription {
    current_period_start: Date,
    current_period_end: Date,
    title: string,
    id: number,
    slug: string
    thumbnail_url: string,
    plan_name: string
    price_in_cents: number
}


export interface UserSubscriptions extends BasicUserInfo {
    results: Subscription[]
    has_next_page: boolean
}