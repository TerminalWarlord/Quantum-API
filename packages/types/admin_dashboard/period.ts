export enum Period {
    hour = "hour",
    day = "day",
    month = "month",
    year = "year",
}
export interface PeriodData {
    period: Period;
    data: {
        timestamp: Date;
        label: string;
        value: number;
    }[]
}

export type GraphPoint = {
  label: string
  value: number
}