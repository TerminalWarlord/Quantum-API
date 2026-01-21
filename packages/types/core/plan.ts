export interface Plan {
    id: number;
    api_id: number;
    name: string;
    monthly_requests: number;
    rate_limit: number;
    features: string;
    price_in_cents: number;
    price_id?: string;
    created_at: Date;
    updated_at: Date;
}


// "id": 4,
// "api_id": 5,
// "name": "Free",
// "monthly_requests": "1000",
// "rate_limit": "100",
// "features": "This has many features....",
// "price_in_cents": 0,
// "price_id": "pri_01kf6dvtnb0d28k8r8kxzndmas",
// "created_at": "2026-01-17 16:50:54.459558",
// "updated_at": "2026-01-17 16:50:54.459558"