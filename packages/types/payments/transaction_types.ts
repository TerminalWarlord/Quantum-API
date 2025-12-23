
export enum TransactionStatusEnums {
    complete = "completed",
    failed = "failed",
    pending = "pending"
}

export interface TransactionType {
    id: string,
    subscription_id: string,
    invoice_id: string,
    payments: {

    },
    details: {
        totals: {
            total: string
        }
    },
    billing_period: {
        starts_at: string,
        ends_at: string
    },
    created_at: string,
    currency_code: string,
    status: TransactionStatusEnums,
}