export enum SubscriptionStatusEnums {
    active = "active",
    cancelled = "canceled",
    paused = "paused",
    past_due = "past_due",
    trialing = "trialing"
}

export interface SubscriptionDataType {
    id: string,
    items: [
        {
            price: {
                id: string
            },
            product: {
                id: string
            }
        }
    ],
    current_billing_period: {
        starts_at: string,
        ends_at: string
    },
    status: SubscriptionStatusEnums,
    custom_data: {
        user_id?: string
    }
}